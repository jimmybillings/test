import { Observable } from 'rxjs/Observable';
import { QuoteConfirmTabComponent } from './quote-confirm-tab.component';
import { MockAppStore } from '../../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Quote Confirm Tab Component', () => {
    let componentUnderTest: QuoteConfirmTabComponent;
    let mockQuoteService: any;
    let mockDialogService: any;
    let mockCapabilities: any;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockQuoteService = {
        state: { data: { id: 1, purchaseType: 'Trial' } },
        data: Observable.of({ data: { id: 1, purchaseType: 'Trial' } }),
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

      mockStore = new MockAppStore();

      componentUnderTest = new QuoteConfirmTabComponent(null, mockQuoteService, mockDialogService, mockCapabilities, mockStore);
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

    describe('quoteIsTrial() getter', () => {
      describe('returns Observable of true', () => {
        it('when the quote is trial', () => {
          let quoteIsTrial: boolean;
          componentUnderTest.quoteIsTrial.take(1).subscribe(result => quoteIsTrial = result);
          expect(quoteIsTrial).toBe(true);
        });
      });
    });

    describe('canPurchase getter', () => {
      describe('returns true', () => {
        it('when the quote is of type \'Trial\'', () => {
          expect(componentUnderTest.canPurchase).toBe(true);
        });

        it('when the quote is not of type \'Trial\', but the other conditions are met', () => {
          componentUnderTest.licensesAreAgreedTo = true;
          mockQuoteService = { hasAssetLineItems: true, state: { data: { purchaseType: 'Not Trial' } } };
          expect(componentUnderTest.canPurchase).toBe(true);
        });
      });

      describe('returns false', () => {
        it('everything is false', () => {
          mockQuoteService = { hasAssetLineItems: false, state: { data: { purchaseType: 'Not Trial' } } };
          mockCapabilities = {
            viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton').and.returnValue(false)
          };

          componentUnderTest = new QuoteConfirmTabComponent(null, mockQuoteService, null, mockCapabilities, mockStore);
          componentUnderTest.licensesAreAgreedTo = false;

          expect(componentUnderTest.canPurchase).toBe(false);
        });
      });
    });
  });
}
