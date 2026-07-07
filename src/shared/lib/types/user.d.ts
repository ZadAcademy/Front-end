import { IDocumentFields } from "./api";

export interface IUserData extends IDocumentFields {
    id:string,
    username:string,
    email:string,
    phone?:string,
    firstName:string,
    lastName:string,
    gender?:string,
    photo?:string,
    emailVerified:boolean,
    phoneVerified:boolean,
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export interface IUserPayload{
    user:IUserData,
    token:string
}