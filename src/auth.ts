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
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${baseUrl}/api/auth/login`, {
                    method: "POST",
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                    headers: {
                        "content-Type": "application/json",
                    },
                });
                const responseData: IApiResponse<ILoginResponse> = await response.json();
                if (!responseData.status) {
                    throw new Error(responseData.message);
                }
                const loginData = responseData.payload!;
                return {
                    id: loginData.user.id,
                    accessToken: loginData.token,
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
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },
};
