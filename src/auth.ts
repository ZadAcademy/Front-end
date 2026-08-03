import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { IApiResponse } from "./shared/lib/types/api";
import { ILoginResponse } from "./shared/lib/types/auth";
import { JWT } from "next-auth/jwt";

/**
 * Calls the backend refresh-token endpoint to get a new access token.
 * Returns the updated JWT or marks the token with an error if refresh fails.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${baseUrl}api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!response.ok) {
            console.error("[Auth] Refresh token request failed:", response.status);
            throw new Error("RefreshTokenFailed");
        }

        const result: IApiResponse<ILoginResponse> = await response.json();

        if (!result.isSuccess) {
            console.error("[Auth] Refresh token API error:", result.message);
            throw new Error(result.message);
        }

        const refreshed = result.data;

        console.log("[Auth] Access token refreshed successfully");

        return {
            ...token,
            token: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            expiresAt: Date.now() + refreshed.expiresIn * 1000,
            error: undefined, // Clear any previous error
        };
    } catch (error) {
        console.error("[Auth] Failed to refresh access token:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
        error: "/login",
    },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;

                const response = await fetch(`${baseUrl}api/v1/auth/login`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                    headers: {
                        "content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorText = await response.clone().text();
                    console.error("BACKEND ERROR DETAILS:", errorText);
                }

                const responseData: IApiResponse<ILoginResponse> = await response.json();
                if (!responseData.isSuccess) {
                    throw new Error(responseData.message);
                }
                const loginData = responseData.data;
                const backendUser = loginData.user as any;
                
                const mappedUser = {
                    id: backendUser.userId,
                    firstName: backendUser.firstName,
                    lastName: backendUser.lastName,
                    email: backendUser.email,
                    phone: backendUser.phoneNumber,
                    role: backendUser.role,
                };

                return {
                    id: mappedUser.id,
                    accessToken: loginData.accessToken,
                    refreshToken: loginData.refreshToken,
                    expiresIn: loginData.expiresIn,
                    user: mappedUser,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            // Initial sign in — store everything from the authorize result
            if (user) {
                token.user = user.user;
                token.token = user.accessToken;
                token.refreshToken = user.refreshToken;
                // user.expiresIn is in seconds
                token.expiresAt = Date.now() + (user.expiresIn * 1000);
                return token;
            }

            // Return previous token if the access token has not expired yet
            if (token.expiresAt && Date.now() < token.expiresAt) {
                return token;
            }

            // Access token has expired — try to refresh it
            console.log("[Auth] Access token expired, attempting refresh...");
            return await refreshAccessToken(token);
        },
        session: ({ session, token }) => {
            session.user = token.user;
            session.error = token.error;
            return session;
        },
    },
};
