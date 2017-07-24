import { QuoteService } from './quote.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Service', () => {
    let serviceUnderTest: QuoteService, mockApi: MockApiService, mockCartService: any,
      mockQuoteStore: any, mockCheckoutStore: any, mockPaymentOptions: any, mockUserService: any;

    function setupFor(options: Array<PaymentOptions> = null) {
      mockPaymentOptions = options ? {
        paymentOptions: options,
        explanation: 'Please select either of the payment options below',
        noCheckout: false
      } : null;
      mockCheckoutStore = { data: Observable.of({ paymentOptions: mockPaymentOptions }) };

      return new QuoteService(null, null, null, mockCheckoutStore, mockUserService);
    }

    beforeEach(() => {
      mockApi = new MockApiService();
      mockCartService = {
        data: Observable.of({ cart: { projects: [] } }),
        state: { cart: { projects: [] } }
      };
      mockQuoteStore = {
        data: Observable.of({ data: { id: 3, ownerUserId: 10, itemCount: 1 } }),
        state: { data: { id: 3, ownerUserId: 10, itemCount: 1 } },
        updateQuote: jasmine.createSpy('updateQuote'),
        addToQuote: jasmine.createSpy('addToQuote')
      };
      mockUserService = {
        getById: jasmine.createSpy('getById').and.returnValue(Observable.of({}))
      };
      mockCheckoutStore = { updateOrderInProgress: jasmine.createSpy('updateOrderInProgress') };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteService(mockApi.injector, mockCartService, mockQuoteStore, mockCheckoutStore, mockUserService);
    });

    describe('data getter', () => {
      it('should return the right data', () => {
        serviceUnderTest.data.take(1).subscribe(d => {
          expect(d).toEqual({ data: { id: 3, ownerUserId: 10, itemCount: 1 } });
        });
      });
    });

    describe('state getter', () => {
      it('should return the right state', () => {
        expect(serviceUnderTest.state).toEqual({ data: { id: 3, ownerUserId: 10, itemCount: 1 } });
      });
    });

    describe('get hasAssets', () => {
      it('should return true if there are assets in the quote', () => {
        serviceUnderTest.hasAssets.take(1).subscribe((has: boolean) => expect(has).toBe(true));
      });
    });

    describe('getQuote', () => {
      it('should call the api service correctly to get a quote', () => {
        mockApi.getResponse = {}
        serviceUnderTest.getQuote(1).take(1).subscribe();
        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('quote/1');
      });

      it('should set the quote in the quote store', () => {
        serviceUnderTest.getQuote(1).take(1).subscribe();
        expect(mockQuoteStore.updateQuote).toHaveBeenCalled();
      });
    });


    describe('paymentOptionsEqual()', () => {
      describe('returns false', () => {
        it('when the store\'s paymentOptions don\'t contain the option to check', () => {
          serviceUnderTest = setupFor(['Hold'] as any);
          serviceUnderTest.paymentOptionsEqual(['CreditCard']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(false);
          });
        });

        it('when the store\'s paymentOptions DO contain the option to check, but the lengths are different', () => {
          serviceUnderTest = setupFor(['Hold'] as any);
          serviceUnderTest.paymentOptionsEqual(['Hold', 'CreditCard']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(false);
          });
        });
      });

      describe('returns true', () => {
        it('when the store\'s paymentOptions contain only the option to check', () => {
          serviceUnderTest = setupFor(['Hold'] as any);
          serviceUnderTest.paymentOptionsEqual(['Hold']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(true);
          });
        });

        it('when the payment options contain both options AND the lengths are the same', () => {
          serviceUnderTest = setupFor(['CreditCard', 'PurchaseOnCredit'] as any);
          serviceUnderTest.paymentOptionsEqual(['CreditCard', 'PurchaseOnCredit']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(true);
          });
        });
      });
    });

    describe('retrieveLicenseAgreements()', () => {
      it('should call the api service correctly', () => {
        serviceUnderTest.retrieveLicenseAgreements();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('quote/licensing/3');
      });
    });

    describe('expireQuote()', () => {
      it('should call the api service correctly', () => {
        serviceUnderTest.expireQuote();

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');

      });
    });

    describe('rejectQuote()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.rejectQuote();

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/reject/3');
      });
    });

    describe('extendExpiration()', () => {
      it('should call the api service correctly', () => {
        serviceUnderTest.extendExpirationDate('2017-01-01');

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          id: 3, ownerUserId: 10, itemCount: 1, expirationDate: new Date('2017-01-01').toISOString(), quoteStatus: 'ACTIVE'
        });
      });
    });
  });
}
