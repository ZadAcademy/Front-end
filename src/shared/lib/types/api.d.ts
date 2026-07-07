

export type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>

export interface IErrorResponse{
    status:false,
    code:number,
    message:string,
    errors?:Array<{
       path: string,
       message?:string,
       messages?:Array<string>
    }>
}

export interface ISuccessResponse<T>{
    status:true,
    code:number,
    message?:string,
    payload:T,
}

export interface IDocumentFields {
  createdAt: string;
  updatedAt: string;
}