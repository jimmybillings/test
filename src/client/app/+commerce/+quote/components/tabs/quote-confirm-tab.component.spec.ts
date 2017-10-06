import { Observable } from 'rxjs/Observable';
import { QuoteConfirmTabComponent } from './quote-confirm-tab.component';

export function main() {
  describe('Quote Confirm Tab Component', () => {
    let componentUnderTest: QuoteConfirmTabComponent;
    let mockQuoteService: any;
    let mockDialogService: any;
    let mockCapabilities: any;

    beforeEach(() => {
      mockQuoteService = {
        state: { data: { id: 1, purchaseType: 'ProvisionalOrder' } },
        data: Observable.of({ data: { id: 1, purchaseType: 'ProvisionalOrder' } }),
        retrieveLicenseAgreements: jasmine.createSpy('retriveLicenseAgreements')
          .and.returnValue(Observable.of({ some: 'licenses' })),
        hasAssetLineItems: true
      };

      mockCapabilities = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton').and.returnValue(true)
      };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.callFake((options: any) => {
          mockDialogService.onCloseCallback = options.outputOptions[0].callback;
        })
      };

      componentUnderTest = new QuoteConfirmTabComponent(null, mockQuoteService, mockDialogService, mockCapabilities);
    });

    describe('showLicenseAgreements()', () => {
      it('calls retrieveLicenseAgreements() on the quote service', () => {
        componentUnderTest.showLicenseAgreements();

        expect(mockQuoteService.retrieveLicenseAgreements).toHaveBeenCalled();
      });

      it('calls openComponentInDialog() on the dialog service (with the right config)', () => {
        componentUnderTest.showLicenseAgreements();

        expect(mockDialogService.openComponentInDialog).toHaveBeenCalledWith({
          componentType: jasmine.any(Function),
          dialogConfig: { panelClass: 'license-pane', position: { top: '10%' } },
          inputOptions: {
            assetType: 'quoteShowAsset',
            parentId: 1,
            licenses: { some: 'licenses' }
          },
          outputOptions: [
            {
              event: 'close',
              callback: jasmine.any(Function),
              closeOnEvent: true
            }
          ]
        });
      });
    });

    describe('showPricing() getter', () => {
      describe('returns false', () => {
        it('when the quote is of type \'ProvisionalOrder\'', () => {
          let showPricing: boolean;
          componentUnderTest.showPricing.take(1).subscribe(result => showPricing = result);
          expect(showPricing).toBe(false);
        });
      });

      describe('returns Observable of true', () => {
        it('when the quote is not of type \'ProvisionalOrder\'', () => {
          mockQuoteService = {
            data: Observable.of({ data: { purchaseType: 'NotProvisionalOrder' } }),
          };
          componentUnderTest = new QuoteConfirmTabComponent(null, mockQuoteService, null, null);

          let showPricing: boolean;
          componentUnderTest.showPricing.take(1).subscribe(result => showPricing = result);
          expect(showPricing).toBe(true);
        });
      });
    });

    describe('quoteIsProvisionalOrder() getter', () => {
      describe('returns Observable of true', () => {
        it('when the quote is provisional order', () => {
          let quoteIsProvisionalOrder: boolean;
          componentUnderTest.quoteIsProvisionalOrder.take(1).subscribe(result => quoteIsProvisionalOrder = result);
          expect(quoteIsProvisionalOrder).toBe(true);
        });
      });
    });

    describe('canPurchase getter', () => {
      describe('returns true', () => {
        it('when the quote is of type \'ProvisionalOrder\'', () => {
          expect(componentUnderTest.canPurchase).toBe(true);
        });

        it('when the quote is not of type \'ProvisionalOrder\', but the other conditions are met', () => {
          componentUnderTest.licensesAreAgreedTo = true;
          mockQuoteService = { hasAssetLineItems: true, state: { data: { purchaseType: 'Not Provisional Order' } } };
          expect(componentUnderTest.canPurchase).toBe(true);
        });
      });

      describe('returns false', () => {
        it('everything is false', () => {
          // quote.purchaseType !== 'ProvisionalOrder'
          // quoteService.hasAssetLineItems === false
          // userCan.viewLicenseAgreementsButton === false
          // licensesAreAgreedTo === false
          mockQuoteService = { hasAssetLineItems: false, state: { data: { purchaseType: 'Not Provisional Order' } } };
          mockCapabilities = {
            viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton').and.returnValue(false)
          };

          componentUnderTest = new QuoteConfirmTabComponent(null, mockQuoteService, null, mockCapabilities);
          componentUnderTest.licensesAreAgreedTo = false;

          expect(componentUnderTest.canPurchase).toBe(false);
        });
      });
    });
  });
}
