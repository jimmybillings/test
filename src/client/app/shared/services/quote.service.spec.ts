import { QuoteService } from './quote.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quote Service', () => {
    let serviceUnderTest: QuoteService, mockApi: MockApiService, mockCartService: any, mockQuoteStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockCartService = {
        data: Observable.of({ cart: { projects: [] } })
      };
      mockQuoteStore = {
        data: Observable.of({ id: 3, ownerUserId: 10 }),
        state: { id: 3, ownerUserId: 10 },
        setQuote: jasmine.createSpy('setQuote')
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

    describe('createQuote', () => {
      it('should call the api service correctly for an "ACTIVE" quote', () => {
        let mockUsers: any[] = [
          { emailAddress: 'ross.edfort@wazeedigital.com', id: 1 },
          { emailAddress: '', id: 2 }, { emailAddress: '', id: 3 }
        ];
        serviceUnderTest.createQuote({
          status: 'ACTIVE',
          emailAddress: 'ross.edfort@wazeedigital.com',
          users: mockUsers,
          quoteType: 'standard'
        }).take(1).subscribe();
        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
        expect(mockApi.post).toHaveBeenCalledWithBody({
          projects: [], quoteStatus: 'ACTIVE', purchaseType: 'standard', ownerUserId: 1
        });
      });

      it('should call the api service correctly for a "PENDING" quote', () => {
        serviceUnderTest.createQuote({ status: 'PENDING', quoteType: 'standard' }).take(1).subscribe();
        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
        expect(mockApi.post).toHaveBeenCalledWithBody({ projects: [], quoteStatus: 'PENDING', purchaseType: 'standard' });
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
        expect(mockQuoteStore.setQuote).toHaveBeenCalled();
      });
    });
  });
}
