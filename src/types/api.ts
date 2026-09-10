export interface ApiResponse<T> { data: T; requestId?: string; }
export interface ApiErrorResponse { message: string; code: string; }
