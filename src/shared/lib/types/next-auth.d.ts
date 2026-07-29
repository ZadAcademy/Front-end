import { IUserData } from "./user";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   * [the returned from authorize function]
   */
  interface User {
    user: IUserData;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   *
   */

  interface Session {
    user: IUserData;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    user: IUserData;
    token: string;
    error?: string;
    expiresAt?: number;
  }
}
