import { QuoteService } from './quote.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Service', () => {
    let serviceUnderTest: QuoteService, mockApi: MockApiService, mockCartService: any,
      mockQuoteStore: any, mockCheckoutStore: any, mockPaymentOptions: any;

    function setupFor(options: Array<PaymentOptions> = null) {
      mockPaymentOptions = options ? {
        paymentOptions: options,
        explanation: 'Please select either of the payment options below',
        noCheckout: false
      } : null;

      mockCheckoutStore = { data: Observable.of({ paymentOptions: mockPaymentOptions }) };

      return new QuoteService(null, null, null, mockCheckoutStore);
    }

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
      mockCheckoutStore = { updateOrderInProgress: jasmine.createSpy('updateOrderInProgress') };
      jasmine.addMatchers(mockApiMatchers);
      serviceUnderTest = new QuoteService(mockApi.injector, mockCartService, mockQuoteStore, mockCheckoutStore);
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

      it('should set the quote in the quote store', () => {
        serviceUnderTest.getQuote(1).take(1).subscribe();
        expect(mockQuoteStore.updateQuote).toHaveBeenCalled();
      });
    });


    describe('paymentOptionsEqual()', () => {
      describe('returns false', () => {
        it('when the store\'s paymentOptions don\'t contain the option to check', () => {
          serviceUnderTest = setupFor(['Hold']);
          serviceUnderTest.paymentOptionsEqual(['CreditCard']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(false);
          });
        });

        it('when the store\'s paymentOptions DO contain the option to check, but the lengths are different', () => {
          serviceUnderTest = setupFor(['Hold']);
          serviceUnderTest.paymentOptionsEqual(['Hold', 'CreditCard']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(false);
          });
        });
      });

      describe('returns true', () => {
        it('when the store\'s paymentOptions contain only the option to check', () => {
          serviceUnderTest = setupFor(['Hold']);
          serviceUnderTest.paymentOptionsEqual(['Hold']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(true);
          });
        });

        it('when the payment options contain both options AND the lengths are the same', () => {
          serviceUnderTest = setupFor(['CreditCard', 'PurchaseOnCredit']);
          serviceUnderTest.paymentOptionsEqual(['CreditCard', 'PurchaseOnCredit']).take(1).subscribe((result: boolean) => {
            expect(result).toBe(true);
          });
        });
      });
    });
  });
}
