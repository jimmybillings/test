import { PricingStore } from './pricing.store';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Pricing Store', () => {
    let storeUnderTest: PricingStore, mockStore: any, mockState: any;

    mockState = { priceForDetails: NaN, priceForDialog: 1000 };

    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
      dispatch: jasmine.createSpy('dispatch')
    };

    beforeEach(() => {
      storeUnderTest = new PricingStore(mockStore);
    });

    describe('data getter', () => {
      it('returns an observable of the right portion of the store', () => {
        storeUnderTest.data.subscribe(d => expect(d).toEqual(mockState));
      });
    });

    describe('state getter', () => {
      it('returns the right portion of the store', () => {
        expect(storeUnderTest.state).toEqual(mockState);
      });
    });

    describe('get priceForDialog', () => {
      it('returns an observable of the right price', () => {
        storeUnderTest.priceForDialog.subscribe(d => expect(d).toBe(1000));
      });
    });

    describe('get priceForDetails', () => {
      it('returns an observable of the right price', () => {
        storeUnderTest.priceForDetails.subscribe(d => expect(d).toEqual(NaN));
      });
    });

    describe('setPriceForDialog()', () => {
      it('should call dispatch on the store with the right action', () => {
        storeUnderTest.setPriceForDialog(100);

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'SET_PRICE_FOR_DIALOG', payload: 100
        });
      });
    });

    describe('setPriceForDetails()', () => {
      it('should call dispatch on the store with the right action', () => {
        storeUnderTest.setPriceForDetails(100);

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'SET_PRICE_FOR_DETAILS', payload: 100
        });
      });
    });
  });
}
