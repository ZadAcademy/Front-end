// ─── PDF Proxy Route ───
// Proxies authenticated requests to the backend PDF endpoint.
// The backend streams PDF binary data directly (no URL returned),
// so this route acts as a secure proxy that adds the auth token
// and pipes the PDF data back to the client.
//
// Client usage: <iframe src="/api/lessons/{lessonId}/pdf" />

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

  // ─── Auth: extract JWT from session cookie ───
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;

  if (!token) {
    console.log("[pdf-proxy] No session token found — unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!decodedToken?.token) {
    console.log("[pdf-proxy] Failed to decode token — unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Proxy the request to the backend ───
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const backendUrl = `${baseUrl}api/v1/lessons/${lessonId}/pdf`;

  console.log("[pdf-proxy] Fetching from backend:", backendUrl);

  try {
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodedToken.token}`,
      },
      cache: "no-store",
    });

    console.log("[pdf-proxy] Backend response status:", backendResponse.status);
    console.log("[pdf-proxy] Backend response headers:", Object.fromEntries(backendResponse.headers.entries()));

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text().catch(() => "Unknown error");
      console.error("[pdf-proxy] Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: backendResponse.status }
      );
    }

    // ─── Stream the response back to the client ───
    const headers = new Headers();
    const contentLength = backendResponse.headers.get("content-length");

    // Force content-type to application/pdf so the browser knows how to render it
    headers.set("content-type", "application/pdf");
    if (contentLength) headers.set("content-length", contentLength);

    // IMPORTANT: Force "inline" so the browser renders the PDF inside the iframe
    // instead of triggering a download. The backend sends "attachment" which
    // causes download managers to intercept it.
    headers.set("content-disposition", "inline");

    // Allow the browser to cache the PDF for the session
    headers.set("cache-control", "private, max-age=3600");

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers,
    });
  } catch (error) {
    console.error("[pdf-proxy] Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
