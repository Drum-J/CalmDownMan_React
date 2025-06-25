import {AxiosError} from "axios";

export interface ApiResponse<T> {
    status: number;
    message: string;
    time: string;
    data: T;
}

export type ApiError<T = string> = AxiosError<ApiResponse<T>>;