import { IDocumentFields } from "./api";

export interface IUserData  {
    id:string,
    email:string,
    phone?:string,
    firstName:string,
    lastName:string,
    role: 'SuperAdmin' | 'Admin' | 'Student'
}

export interface IUserPayload{
    user:IUserData,
    token:string
}