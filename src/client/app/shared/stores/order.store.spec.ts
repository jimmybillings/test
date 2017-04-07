import { Observable } from 'rxjs/Observable';

import { order, OrderStore } from './order.store';

export function main() {
  describe('order reducer', () => {
    it('returns the payload for ORDER.SET_CURRENT_ORDER', () => {
      expect(order({ current: 'State' }, { type: 'ORDER.SET_CURRENT_ORDER', payload: { someKey: 'someValue' } }))
        .toEqual({ someKey: 'someValue' });
    });

    it('returns the current state for an unexpected action type', () => {
      expect(order({ current: 'State' }, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual({ current: 'State' });
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(order(undefined, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual({ id: 1, projects: [], orderStatus: '', orderType: '' });
    });
  });

  describe('Order Store', () => {
    let mockStore: any;
    let storeUnderTest: OrderStore;

    beforeEach(() => {
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ someKey: 'someValue' })),
        dispatch: jasmine.createSpy('dispatch')
      };
      storeUnderTest = new OrderStore(mockStore);
    });

    describe('data getter', () => {
      it('accesses the right part of the global store', () => {
        storeUnderTest.data.subscribe();
        expect(mockStore.select).toHaveBeenCalledWith('order');
      });

      it('returns the expected data', () => {
        storeUnderTest.data.subscribe(data => {
          expect(data).toEqual({ someKey: 'someValue' });
        });
      });
    });

    describe('update()', () => {
      it('dispatches ORDER.SET_CURRENT_ORDER with the passed-in order', () => {
        storeUnderTest.update({ something: 'else' });

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'ORDER.SET_CURRENT_ORDER', payload: { something: 'else' } });
      });
    });

    describe('state()', () => {
      it('returns the current store state', () => {
        expect(storeUnderTest.state).toEqual({ someKey: 'someValue' });
      });
    });
  });
}
