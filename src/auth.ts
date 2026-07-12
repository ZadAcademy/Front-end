import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { IApiResponse } from "./shared/lib/types/api";
import { ILoginResponse } from "./shared/lib/types/auth";


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
                return {
                    id: loginData.user.id,
                    accessToken: loginData.accessToken,
                    refreshToken: loginData.refreshToken,
                    expiresIn: loginData.expiresIn,
                    user: loginData.user,
                };
            },
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.user = user.user;
                token.token = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expiresIn = user.expiresIn;
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },
};
