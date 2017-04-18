import { QuoteStore, quote } from './quote.store';
import { Observable } from 'rxjs/Observable';
import { QuoteState } from '../interfaces/quote.interface';

export function main() {
  const initState: QuoteState = {
    data: {
      id: 0,
      total: 0,
      createdUserId: 0,
      ownerUserId: 0,
      quoteStatus: 'PENDING'
    },
    orderInProgress: {
      purchaseOptions: {
        purchaseOnCredit: false,
        creditExemption: false
      },
      addresses: [],
      selectedAddress: {
        type: '',
        name: '',
        defaultAddress: undefined,
        addressEntityId: undefined,
        address: {
          address: '',
          state: '',
          city: '',
          country: '',
          zipcode: '',
          phone: ''
        }
      },
      authorization: {
        card: {
          brand: '',
          last4: '',
          exp_month: '',
          exp_year: ''
        }
      },
      selectedPurchaseType: ''
    }
  };

  describe('quote reducer', () => {
    it('returns the payload for QUOTE.SET_QUOTE', () => {
      expect(quote(initState, { type: 'QUOTE.SET_QUOTE', payload: { key: 'value' } }))
        .toEqual({ data: { key: 'value' } });
    });

    it('returns the payload for QUOTE.UPDATE_QUOTE', () => {
      let mockPayload: any = { key: 'value' };
      let expectedState: any = Object.assign({}, initState, { data: mockPayload });
      expect(quote(initState, { type: 'QUOTE.UPDATE_QUOTE', payload: mockPayload }))
        .toEqual(expectedState);
    });

    it('returns the current state for an unexpected action type', () => {
      expect(quote(initState, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual(initState);
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(quote(undefined, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual(initState);
    });
  });

  describe('Quote Store', () => {
    let storeUnderTest: QuoteStore, mockStore: any;

    beforeEach(() => {
      mockStore = {
        dispatch: jasmine.createSpy('dispatch'),
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ key: 'value' }))
      };
      storeUnderTest = new QuoteStore(mockStore);
    });

    describe('data getter', () => {
      it('should return the right data', () => {
        storeUnderTest.data.take(1).subscribe(d => {
          expect(d).toEqual({ key: 'value' });
        });
      });

      it('should call store.select() with "quote"', () => {
        storeUnderTest.data.take(1).subscribe();

        expect(mockStore.select).toHaveBeenCalledWith('quote');
      });
    });

    describe('state', () => {
      it('should return the right state', () => {
        expect(storeUnderTest.state).toEqual({ key: 'value' });
      });
    });

    describe('updateQuote', () => {
      it('should call dispatch on the store with the right payload', () => {
        let newQuote: any = { new: 'quote' };
        storeUnderTest.updateQuote(newQuote);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'QUOTE.UPDATE_QUOTE', payload: newQuote });
      });
    });

    describe('replaceQuote', () => {
      it('should call dispatch on the store with the right payload', () => {
        let newQuote: any = { new: 'quote' };
        storeUnderTest.replaceQuote(newQuote);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'QUOTE.SET_QUOTE', payload: newQuote });
      });
    });
  });
}
