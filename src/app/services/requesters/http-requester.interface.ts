export interface HttpClient {
    post(url: string, payload: object): Promise<any>;
}