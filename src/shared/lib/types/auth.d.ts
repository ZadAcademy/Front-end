import { IUserData } from "./user";

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: IUserData;
}