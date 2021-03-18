export class StoreSubscription<T> {
    constructor(
        private readonly callback: (state: T) => void,
        private readonly unsubscribeCallback: (subscription: StoreSubscription<T>) => void,
        public readonly keys: (keyof T)[]
    ) {}

    emit(state: T): void {
        this.callback(state);
    }

    unsubscribe() {
        this.unsubscribeCallback(this);
    }
}