import { IUserData } from "./user";

export interface ILoginResponse{
    user:IUserData,
    token:string
}