export interface INotifier {
    notify(user, message: string): Promise<void>
}