export type ApiErrorResponse = {
    error: string;
    fieldErrors?: Record<string, string[]>; 
}