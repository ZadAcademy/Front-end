

export type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>

export interface IErrorResponse{
    isSuccess: false,
    code: number,
    message: string,
    errors?: Array<string>,
    statusCode: number
}

export interface ISuccessResponse<T>{
    isSuccess: true,
    statusCode: number,
    message: string,
    data: T,
    errors?: Array<string>
}

