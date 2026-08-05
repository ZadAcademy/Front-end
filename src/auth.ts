import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { IApiResponse } from "./shared/lib/types/api";
import { ILoginResponse } from "./shared/lib/types/auth";
import { JWT } from "next-auth/jwt";

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
            }

            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            session.error = token.error;
            return session;
        },
    },
};
