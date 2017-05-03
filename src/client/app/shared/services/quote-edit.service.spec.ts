import { QuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Edit Service', () => {
    let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockQuoteStore: any, mockFeeConfigStore: any;

    beforeEach(() => {
      mockApi = new MockApiService();
      mockQuoteStore = {
        data: Observable.of({ data: { id: 3, ownerUserId: 10 } }),
        state: { data: { id: 3, ownerUserId: 10 } },
        replaceQuote: jasmine.createSpy('replaceQuote'),
        updateQuote: jasmine.createSpy('updateQuote')
      };
      mockFeeConfigStore = {};
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteEditService(mockQuoteStore, mockFeeConfigStore, mockApi.injector);
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

    describe('addFeeTo()', () => {
      it('calls the API service as expected', () => {
        serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/fee/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithBody({ some: 'fee' });
        expect(mockApi.put).toHaveBeenCalledWithParameters({ projectName: 'projectName' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the current quote', () => {
        serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

        expect(mockQuoteStore.replaceQuote).toHaveBeenCalled();
      });
    });


    describe('removeFee()', () => {
      it('calls the API service as expected', () => {
        serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/fee/47');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the current quote', () => {
        serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

        expect(mockQuoteStore.replaceQuote).toHaveBeenCalled();
      });
    });

    describe('feeconfig getter', () => {
      describe('when the FeeConfig store is initialized', () => {
        beforeEach(() => {
          mockFeeConfigStore.initialized = true;
          mockFeeConfigStore.feeConfig = { existing: 'feeConfig' };
        });

        it('returns an Observable of the existing FeeConfig store', () => {
          expect(serviceUnderTest.feeConfig).toEqual(Observable.of({ existing: 'feeConfig' }));
        });
      });

      describe('when the FeeConfig store is not initialized', () => {
        beforeEach(() => {
          mockFeeConfigStore.initialized = false;
          mockFeeConfigStore.replaceFeeConfigWith = jasmine.createSpy('replaceFeeConfigWith');
          mockApi.getResponse = { loaded: 'feeConfig' };
        });

        it('calls the server\'s feeconfig endpoint as expected', () => {
          serviceUnderTest.feeConfig;

          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('feeConfig/search');
          expect(mockApi.get).not.toHaveBeenCalledWithBody();
          expect(mockApi.get).not.toHaveBeenCalledWithParameters();
          expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        });

        it('replaces the contents of the FeeConfig store', () => {
          serviceUnderTest.feeConfig.subscribe(response => {
            expect(mockFeeConfigStore.replaceFeeConfigWith).toHaveBeenCalledWith({ loaded: 'feeConfig' });
          });
        });

        it('returns an Observable of the server\'s returned FeeConfig', () => {
          serviceUnderTest.feeConfig.subscribe(response => {
            expect(response).toEqual({ loaded: 'feeConfig' });
          });
        });
      });
    });
  });
}
