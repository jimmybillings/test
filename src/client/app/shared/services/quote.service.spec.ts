import { QuoteService } from './quote.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Service', () => {
    let serviceUnderTest: QuoteService, mockApi: MockApiService, mockCartService: any, mockQuoteStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockCartService = {
        data: Observable.of({ cart: { projects: [] } }),
        state: { cart: { projects: [] } }
      };
      mockQuoteStore = {
        data: Observable.of({ id: 3, ownerUserId: 10 }),
        state: { id: 3, ownerUserId: 10 },
        updateQuote: jasmine.createSpy('updateQuote')
      };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteService(mockApi.injector, mockCartService, mockQuoteStore);
    });

    describe('data getter', () => {
      it('should return the right data', () => {
        serviceUnderTest.data.take(1).subscribe(d => {
          expect(d).toEqual({ id: 3, ownerUserId: 10 });
        });
      });
    });

    describe('state getter', () => {
      it('should return the right state', () => {
        expect(serviceUnderTest.state).toEqual({ id: 3, ownerUserId: 10 });
      });
    });

    describe('getQuote', () => {
      it('should call the api service correctly', () => {
        serviceUnderTest.getQuote(1).take(1).subscribe();
        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('quote/1');
      });

      it('should set the quote in the store', () => {
        serviceUnderTest.getQuote(1).take(1).subscribe();
        expect(mockQuoteStore.updateQuote).toHaveBeenCalled();
      });
    });
  });
}
