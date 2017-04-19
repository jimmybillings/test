import { QuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Edit Service', () => {
    let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockQuoteStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockQuoteStore = {
        data: Observable.of({ data: { id: 3, ownerUserId: 10 } }),
        state: { data: { id: 3, ownerUserId: 10 } },
        replaceQuote: jasmine.createSpy('replaceQuote'),
        updateQuote: jasmine.createSpy('updateQuote')
      };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteEditService(mockQuoteStore, mockApi.injector);
    });

    describe('sendQuote', () => {
      it('should call the api service correctly', () => {
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
        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          id: 3,
          ownerUserId: 1,
          purchaseType: 'ProvisionalOrder',
          expirationDate: '2017-03-22T06:00:00.000Z',
          quoteStatus: 'ACTIVE',
        });
      });
    });
  });
}
