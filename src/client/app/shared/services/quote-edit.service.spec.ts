import { QuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  xdescribe('Quote Edit Service', () => {
    let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockQuoteStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockQuoteStore = {
        data: Observable.of({ id: 3, ownerUserId: 10 }),
        state: { id: 3, ownerUserId: 10 },
        replaceQuoteWith: jasmine.createSpy('replaceQuoteWith'),
        updateQuoteWith: jasmine.createSpy('updateQuoteWith')
      };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteEditService(null, null);
    });

    describe('sendQuote', () => {
      it('should call the api service correctly for an "ACTIVE" quote', () => {
        let mockUsers: any[] = [
          { emailAddress: 'ross.edfort@wazeedigital.com', id: 1 },
          { emailAddress: '', id: 2 }, { emailAddress: '', id: 3 }
        ];
        serviceUnderTest.sendQuote({
          emailAddress: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017/03/22',
          users: mockUsers,
          purchaseType: 'ProvisionalOrder'
        }).take(1).subscribe();
        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
        expect(mockApi.post).toHaveBeenCalledWithBody({
          projects: [], quoteStatus: 'ACTIVE', purchaseType: 'ProvisionalOrder', expirationDate: '2017/03/22', ownerUserId: 1
        });
      });

      it('should call the api service correctly for a "PENDING" quote', () => {
        serviceUnderTest.sendQuote({ purchaseType: 'ProvisionalOrder' }).take(1).subscribe();
        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
        expect(mockApi.post).toHaveBeenCalledWithBody({ projects: [], purchaseType: 'ProvisionalOrder' });
      });

      it('should remove the purchaseType param if it\'s "standard"', () => {
        serviceUnderTest.sendQuote({ purchaseType: 'standard' }).take(1).subscribe();
        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
        expect(mockApi.post).toHaveBeenCalledWithBody({ projects: [], quoteStatus: 'PENDING' });
      });
    });
  });
}
