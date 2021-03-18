import { assert, expect, spy, use } from "chai";
import * as spies from 'chai-spies'
import { createStore, TestStore } from "./data";

use(spies.default);

describe('subscription', () => {
    it('can subscribe to store', () => {
        const [store, ] = createStore();
        const callback = () => {};
        const subscription = store.subscribe(callback);
        assert.exists(subscription);
        assert.equal(store.numberOfSubscribers, 1);
    });

    it('callback called when state changes', () => {
        const [store, ] = createStore();
        const newCount = store.state.count + 10;
        const callback = (state: TestStore) => {
            assert.equal(state.count, newCount);
        }
        const iSpy = spy(callback);

        store.subscribe(iSpy);
        store.setValue('count', newCount);

        expect(iSpy).to.have.been.called();
    });

    it('subscribe to properties has correct keys', () => {
        const [store,] = createStore();

        const subscription = store.subscribe(() => {});
        assert.isEmpty(subscription.keys);

        const subscription2 = store.subscribe(() => {}, 'count');
        assert.deepEqual(subscription2.keys, ['count']);

        const subscription3 = store.subscribe(() => {}, 'count', 'location');
        assert.deepEqual(subscription3.keys, ['count', 'location']);
    });

    it('callback called when subscribed property changes', () => {
        const [store, ] = createStore();
        const newCount = store.state.count + 10;
        const callback = (state: TestStore) => {
            assert.equal(state.count, newCount);
        }
        const iSpy = spy(callback);

        store.subscribe(iSpy, 'count');
        store.setValue('count', newCount);

        expect(iSpy).to.have.been.called();
    });

    it('callback not called when non-subscribed property changes', () => {
        const [store, ] = createStore();
        const iSpy = spy();

        store.subscribe(iSpy, 'count');
        store.setValue('name', 'asdf');

        expect(iSpy).to.have.not.been.called();
    });

    it('callback called when one of subscribed properties change', () => {
        const [store, ] = createStore();
        const iSpy = spy();

        store.subscribe(iSpy, 'count', 'name');
        store.setValue('name', 'asdfasdf');

        expect(iSpy).to.have.been.called();
    });

    it('callback not called when one of non-subscribed properties change', () => {
        const [store, ] = createStore();
        const iSpy = spy();

        store.subscribe(iSpy, 'count', 'location');
        store.setValue('name', 'asdf');

        expect(iSpy).to.have.not.been.called();
    });

    it('callback not called when unsubscribed', () => {
        const [store, ] = createStore();
        const iSpy = spy();
        const subscription = store.subscribe(iSpy, 'count');

        subscription.unsubscribe();
        store.setValue('name', 'asdf');

        expect(iSpy).to.have.not.been.called();
    });

    it('unsubscribe more than once', () => {
        const [store, ] = createStore();
        const callback = () => {};
        const subscription = store.subscribe(callback);
        subscription.unsubscribe();
        subscription.unsubscribe();
        assert.equal(store.numberOfSubscribers, 0);
    });

    describe('multiple subscribers', () => {
        it('can have multiple subscriptions', () => {
            const [store, ] = createStore();
            const callback = () => {};
            const sub1 = store.subscribe(callback);
            const sub2 = store.subscribe(callback);
            const sub3 = store.subscribe(callback);
            assert.exists(sub1);
            assert.exists(sub2);
            assert.exists(sub3);
            assert.notEqual(sub1, sub2);
            assert.notEqual(sub1, sub3);
            assert.equal(store.numberOfSubscribers, 3);
        });

        it('different property subscriptions - only one is called with property subscription', () => {
            const [store, ] = createStore();
            const newCount = store.state.count + 10;
            const callback1 = (state: TestStore) => {
                assert.equal(state.count, newCount);
            }
            const iSpy1 = spy(callback1);
            const iSpy2 = spy();

            store.subscribe(iSpy1, 'count');
            store.subscribe(iSpy2, 'name');
            store.setValue('count', newCount);

            expect(iSpy1).to.have.been.called();
            expect(iSpy2).to.have.not.been.called();
        });

        it("error doesn't stop other callbacks", () => {
            const [store, ] = createStore();
            const newCount = store.state.count + 10;
            const callback = () => {
                throw new Error("Some error");
            }
            const iSpy1 = spy(callback);
            const iSpy2 = spy(callback);

            store.subscribe(iSpy1);
            store.subscribe(iSpy2);
            store.setValue('count', newCount);

            expect(iSpy1).to.have.been.called();
            expect(iSpy2).to.have.been.called();
        });

        it("one unsubs the other still emits", () => {
            const [store, ] = createStore();
            const iSpy1 = spy();
            const iSpy2 = spy();
            const iSpy3 = spy();

            const sub1 = store.subscribe(iSpy1);
            store.subscribe(iSpy2);
            store.subscribe(iSpy3);

            sub1.unsubscribe();
            store.setValue('count', 14);

            expect(iSpy1).to.not.have.been.called();
            expect(iSpy2).to.have.been.called();
            expect(iSpy3).to.have.been.called();
        });

        it('unsubscribe more than once', () => {
            const [store, ] = createStore();
            const callback = () => {};
            const sub1 = store.subscribe(callback);
            const sub2 = store.subscribe(callback);
            const sub3 = store.subscribe(callback);
            sub1.unsubscribe();
            sub1.unsubscribe();
            assert.equal(store.numberOfSubscribers, 2);
    
            sub2.unsubscribe();
            sub2.unsubscribe();
            assert.equal(store.numberOfSubscribers, 1);
    
            sub3.unsubscribe();
            sub3.unsubscribe();
            assert.equal(store.numberOfSubscribers, 0);
        });
    });
})
