export interface IHttpRequester {
    post(url: string, payload: object): Promise<any>;
}