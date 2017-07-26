import { QuoteService } from './quote.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../shared/interfaces/commerce.interface';
export function main() {
  describe('Quote Service', () => {
    let serviceUnderTest: QuoteService, mockApi: MockApiService, mockCartService: any,
      mockQuoteStore: any, mockCheckoutStore: any, mockPaymentOptions: any, mockUserService: any;
    const mockQuoteResponse = {
      'createdUserId': 1,
      'lastUpdated': '2017-07-23T18:41:21Z',
      'createdOn': '2017-07-23T18:20:00Z',
      'id': 282,
      'siteName': 'commerce',
      'projects': [
        {
          'name': '2017-04-27',
          'id': '390bec17-929b-452d-a2f4-27b7b04cb6ea',
          'lineItems': [
            {
              'asset': {
                'assetId': 33737670
              },
              'id': 'f642f893-f4cf-4a3c-ad5e-dc2d0cd1a321',
              'subTotal': 159
            }
          ],
          'assetLineItemSubtotal': 159,
          'feeLineItemSubtotal': 0,
          'totalAmount': 79.5,
          'subTotal': 159
        }
      ]
    };
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
        getById: jasmine.createSpy('getById').and.returnValue(Observable.of(
          { emailAddress: 'test@gmail.com', firstName: 'best', lastName: 'tester' }))
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

    describe('load()', () => {

      beforeEach(() => {
        mockApi.getResponse = JSON.parse(JSON.stringify(mockQuoteResponse));
      });

      describe('Admin user', () => {
        it('should call the api service correctly to get a quote', () => {
          serviceUnderTest.load(1, true).take(1).subscribe();
          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('quote/1');
          expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        });

        it('Should call the user service getById() with the createdUserId', () => {
          serviceUnderTest.load(1, true).take(1).subscribe();
          expect(mockUserService.getById).toHaveBeenCalledWith(1);
        });

        it('should set the quote in the quote store with the user added to the quote response', () => {
          serviceUnderTest.load(1, true).take(1).subscribe();
          let testResponse: Quote = JSON.parse(JSON.stringify(mockQuoteResponse));
          testResponse = Object.assign(testResponse, {
            createdUserFullName: 'best tester',
            createdUserEmailAddress: 'test@gmail.com'
          });
          expect(mockQuoteStore.updateQuote).toHaveBeenCalledWith(testResponse);
        });
      });

      describe('End User', () => {
        it('should call the api service correctly to get a quote', () => {
          serviceUnderTest.load(1, false).take(1).subscribe();
          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('quote/1');
          expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        });

        it('Should not call the user service getById() with the createdUserId', () => {
          serviceUnderTest.load(1, false).take(1).subscribe();
          expect(mockUserService.getById).not.toHaveBeenCalled();
        });

        it('should set the quote in the quote store', () => {
          serviceUnderTest.load(1, false).take(1).subscribe();
          expect(mockQuoteStore.updateQuote)
            .toHaveBeenCalledWith(JSON.parse(JSON.stringify(mockQuoteResponse)));
        });
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
      beforeEach(() => {
        mockApi.putResponse = JSON.parse(JSON.stringify(mockQuoteResponse));
      });
      it('should call the api service correctly', () => {
        serviceUnderTest.extendExpirationDate('2017-01-01');

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          id: 3, ownerUserId: 10, itemCount: 1, expirationDate: new Date('2017-01-01').toISOString(), quoteStatus: 'ACTIVE'
        });
      });

      it('Should call the user service getById() with the createdUserId', () => {
        serviceUnderTest.extendExpirationDate('2017-01-01').subscribe();
        expect(mockUserService.getById).toHaveBeenCalledWith(1);
      });

      it('should set the quote in the quote store with the user added to the quote response', () => {
        serviceUnderTest.extendExpirationDate('2017-01-01').subscribe();
        let testResponse: Quote = JSON.parse(JSON.stringify(mockQuoteResponse));
        testResponse = Object.assign(testResponse, {
          createdUserFullName: 'best tester',
          createdUserEmailAddress: 'test@gmail.com'
        });
        expect(mockQuoteStore.updateQuote).toHaveBeenCalledWith(testResponse);
      });
    });
  });
}
