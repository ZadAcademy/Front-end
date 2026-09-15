import { IDocumentFields } from "./api";

export interface IUserData  {
    id:string,
    email:string,
    phone?:string,
    firstName:string,
    lastName:string,
    role: 'SuperAdmin' | 'Admin' | 'Student',
    profileImageUrl?: string;
}

export interface IUserPayload{
    user:IUserData,
    token:string
}