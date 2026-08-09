import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { IApiResponse } from "./shared/lib/types/api";
import { ILoginResponse } from "./shared/lib/types/auth";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}api/v1/auth/refresh-token`, {
            method: "POST",
            body: JSON.stringify({
                accessToken: token.token,
                refreshToken: token.refreshToken,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.isSuccess) {
            throw new Error(responseData.message || "Failed to refresh token");
        }

        const refreshedData = responseData.data;

        return {
            ...token,
            token: refreshedData.accessToken,
            refreshToken: refreshedData.refreshToken ?? token.refreshToken, // Fall back to old refresh token
            accessTokenExpires: Date.now() + (refreshedData.expiresIn * 1000),
            error: undefined,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
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
                // NextAuth uses ms for Date.now(), we assume expiresIn is in seconds.
                token.accessTokenExpires = Date.now() + (user.expiresIn * 1000);
            }

            // Return previous token if the access token has not expired yet
            // Subtracting a 10-second buffer to ensure the token is still valid when it reaches the server
            if (Date.now() < token.accessTokenExpires - 10000) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        session: ({ session, token }) => {
            session.user = token.user;
            session.error = token.error;
            return session;
        },
    },
};

