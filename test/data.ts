import { Store } from "../src/store";

export interface TestStore {
    name: string;
    count: number;
    location?: {
        address: string;
        coords: {
            lat: number;
            long: number;
        }
    }
}

export const createStore = (): [Store<TestStore>, TestStore] => {
    let store: Store<TestStore>;
    let defaultValue:TestStore = {
        name: 'testing',
        count: 10,
        location: {
            address: '111 lane dr',
            coords: {
                lat: 30,
                long: 30
            }
        }
    }; 

    store = new Store('store', defaultValue);
    return [store, defaultValue];
}