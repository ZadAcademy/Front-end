// ─── Video Stream Proxy Route ───
// Proxies authenticated requests to the backend video stream endpoint.
// The backend streams video binary data directly (no URL returned),
// so this route acts as a secure proxy that adds the auth token
// and pipes the video stream back to the client.
//
// Client usage: <video src="/api/lessons/{lessonId}/video-stream" />

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;

  // ─── Auth: extract JWT from session cookie ───
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;

  if (!token) {
    console.log("[video-stream] No session token found — unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!decodedToken?.token) {
    console.log("[video-stream] Failed to decode token — unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Proxy the request to the backend ───
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const backendUrl = `${baseUrl}api/v1/lessons/${lessonId}/google-drive-video/stream`;

  

  // Forward the Range header from the browser if present.
  // Browsers send Range headers for video playback (seeking, partial loading).
  const rangeHeader = req.headers.get("range");
  

  try {
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodedToken.token}`,
        // Forward Range header so backend can respond with 206 Partial Content
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
      // Don't cache video streams
      cache: "no-store",
    });
    console.log("[video-stream] Backend response:", backendResponse);
    console.log("[video-stream] Backend headers:", backendResponse.headers);
    console.log("[video-stream] Backend body:", backendResponse.body);


    // Both 200 (full content) and 206 (partial content) are valid for video streaming
    if (!backendResponse.ok && backendResponse.status !== 206) {
      const errorText = await backendResponse.text().catch(() => "Unknown error");
      console.error("[video-stream] Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch video stream" },
        { status: backendResponse.status }
      );
    }

    // ─── Stream the response back to the client ───
    // Forward relevant headers from the backend (content-type, content-length, etc.)
    const headers = new Headers();
    const contentType = backendResponse.headers.get("content-type");
    const contentLength = backendResponse.headers.get("content-length");
    const contentRange = backendResponse.headers.get("content-range");
    const acceptRanges = backendResponse.headers.get("accept-ranges");

    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    if (contentRange) headers.set("content-range", contentRange);
    if (acceptRanges) headers.set("accept-ranges", acceptRanges);

    // Allow the browser to cache the video for the session
    headers.set("cache-control", "private, max-age=3600");

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers,
    });
  } catch (error) {
    console.error("[video-stream] Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
