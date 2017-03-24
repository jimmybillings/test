import { QuotesStore, quotes } from './quotes.store';
import { Observable } from 'rxjs/Rx';

export function main() {
  const initState: any = { quotes: [] };

  describe('quotes reducer', () => {
    it('returns the payload for QUOTES.SET_QUOTES', () => {
      expect(quotes(initState, { type: 'QUOTES.SET_QUOTES', payload: [{ key: 'value' }] }))
        .toEqual({
          quotes: [{ key: 'value' }]
        });
    });

    it('returns the current state for an unexpected action type', () => {
      expect(quotes(initState, { type: 'BLAH', payload: [{ someKey: 'someValue' }] }))
        .toEqual(initState);
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(quotes(undefined, { type: 'BLAH', payload: [{ someKey: 'someValue' }] }))
        .toEqual(initState);
    });
  });

  describe('Quotes Store', () => {
    let storeUnderTest: QuotesStore, mockStore: any;

    beforeEach(() => {
      mockStore = {
        dispatch: jasmine.createSpy('dispatch'),
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ quotes: [{ key: 'value' }] }))
      };
      storeUnderTest = new QuotesStore(mockStore);
    });

    describe('data getter', () => {
      it('should return the right data', () => {
        storeUnderTest.data.take(1).subscribe(d => {
          expect(d).toEqual({ quotes: [{ key: 'value' }] });
        });
      });

      it('should call store.select() with "quotes"', () => {
        storeUnderTest.data.take(1).subscribe();

        expect(mockStore.select).toHaveBeenCalledWith('quotes');
      });
    });

    describe('state', () => {
      it('should return the right state', () => {
        expect(storeUnderTest.state).toEqual({ quotes: [{ key: 'value' }] });
      });
    });

    describe('setQuotes', () => {
      it('should call dispatch on the store with the right payload', () => {
        let newQuotes: any = [{ new: 'quote' }];
        storeUnderTest.setQuotes(newQuotes);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'QUOTES.SET_QUOTES', payload: newQuotes });
      });
    });
  });
}
