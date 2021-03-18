import { assert } from "chai";
import { Store } from "../src/store"
import { createStore, TestStore } from "./data";


describe('store', () => {
    it('initial state is default value', () => {
        const [store, defaultValue] = createStore();
        assert.deepStrictEqual(store.state, defaultValue);
    });

    it('shallow set value changes state', () => {
        const [store, defaultValue] = createStore();
        store.setValue('name', 'some other name');
        assert.equal(store.state.name, 'some other name');
    });

    it('deep set value changes state', () => {
        const [store, defaultValue] = createStore();

        const coords = {
            lat: 50,
            long: 50
        };

        store.setValue('location', {
            address: store.state.location!.address,
            coords: coords
        });
        assert.equal(store.state.location?.coords, coords);
    });

    it('empty store name throws error', () => {
        assert.Throw(() => {
            new Store<any>('', null);
        })
    });

    it('set state sets all new states', () => {
        const [store,] = createStore();

        const newState: TestStore = {
            name: 'new testing',
            count: 1000,
            location: {
                address: '222 sunny dr',
                coords: {
                    lat: 10,
                    long: 10
                }
            }
        };

        store.setState(newState);
        assert.deepStrictEqual(store.state, newState);
    });

    it('reset value sets back to default', () => {
        const [store, defaultValue] = createStore();

        const newState: TestStore = {
            name: 'new testing',
            count: 1000,
            location: {
                address: '222 sunny dr',
                coords: {
                    lat: 10,
                    long: 10
                }
            }
        };

        store.setState(newState);

        store.reset();
        assert.deepStrictEqual(store.state, defaultValue);
    });

    it('correct number of subscribers', () => {
        const [store,] = createStore();

        const sub1 = store.subscribe(() => {});
        const sub2 = store.subscribe(() => {});
        const sub3 = store.subscribe(() => {});

        assert.equal(store.numberOfSubscribers, 3);

        sub1.unsubscribe();
        sub2.unsubscribe();
        assert.equal(store.numberOfSubscribers, 1);

        sub3.unsubscribe();
        assert.equal(store.numberOfSubscribers, 0);
    });
})

