import { Observable } from 'rxjs/Rx';

import { cart, CartStore } from './cart.store';

export function main() {
  describe('cart reducer', () => {
    it('returns the payload for REPLACE_CART', () => {
      expect(cart({ cart: {}, orderInProgress: {} }, { type: 'REPLACE_CART', payload: { someKey: 'someValue' } }))
        .toEqual({ orderInProgress: {}, cart: { someKey: 'someValue' } });
    });

    it('returns the current state for an unexpected action type', () => {
      expect(cart({ current: 'State' }, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual({ current: 'State' });
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(cart(undefined, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual({
          cart: {
            userId: NaN,
            total: 0
          },
          orderInProgress: {
            address: {
              type: '',
              name: '',
              address: {
                address: '',
                state: '',
                city: '',
                country: '',
                zipcode: '',
                phone: '',
                suburb: ''
              }
            },
            authorization: {}
          }
        });
    });
  });

  describe('Cart Store', () => {
    let mockStore: any;
    let storeUnderTest: CartStore;

    beforeEach(() => {
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ someKey: 'someValue' })),
        dispatch: jasmine.createSpy('dispatch')
      };
      storeUnderTest = new CartStore(mockStore);
    });

    describe('data getter', () => {
      it('accesses the right part of the global store', () => {
        storeUnderTest.data.subscribe();
        expect(mockStore.select).toHaveBeenCalledWith('cart');
      });

      it('returns the expected data', () => {
        storeUnderTest.data.subscribe(data => {
          expect(data).toEqual({ someKey: 'someValue' });
        });
      });
    });

    describe('replaceWith()', () => {
      it('dispatches REPLACE_CART with the passed-in cart', () => {
        storeUnderTest.replaceCartWith({ something: 'else' });

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'REPLACE_CART', payload: { something: 'else' } });
      });
    });

    describe('state()', () => {
      it('returns the current store state', () => {
        expect(storeUnderTest.state).toEqual({ someKey: 'someValue' });
      });
    });
  });
}
