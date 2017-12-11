export interface INotifier {
    notifySuccess(user, message: string): Promise<void>
    notifyInfo(user, message: string): Promise<void>
    notifyError(user, message: string): Promise<void>
}