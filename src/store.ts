import { EnsureType } from "./types/ensureType";
import { StoreSubscription } from "./types/storeSubscription";

export class Store<T extends {}> {
    state: Readonly<T>;
    private readonly subscriptions: StoreSubscription<T>[];

    constructor(readonly name: string, readonly defaultValue: T) {
        this.state = defaultValue;
        this.subscriptions = [];
    }

    setValue<J extends keyof T>(key: J, value: EnsureType<T>[J]): void {
        this.state = {
            ...this.state,
            [key]: value
        }
        this.notify(key);
    }

    setState(state: T): void {
        this.state = state;
        this.notify();
    }

    reset(): void {
        this.state = this.defaultValue;
        this.notify();
    }

    subscribe(callback: (state: T) => void, ...keys: (keyof T)[]): StoreSubscription<T> {
        const subscription = new StoreSubscription<T>(
            callback,
            this.unsubscribe.bind(this),
            keys
        );

        this.subscriptions.push(subscription);
        return subscription;
    }

    private unsubscribe(subscription: StoreSubscription<T>) {
        const index = this.subscriptions.indexOf(subscription);
        this.subscriptions.splice(index, 1);
    }

    private notify(key?: keyof T): void {
        let subscriptions = !!key ? this.subscriptions.filter(s => s.keys.length == 0 || s.keys.indexOf(key) >= 0) : this.subscriptions;
        for(const subscription of subscriptions) {
            subscription.emit(this.state);
        }
    }
}

