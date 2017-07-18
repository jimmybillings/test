import { QuoteTabComponent } from './quote-tab.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Tab Component', () => {
    let componentUnderTest: QuoteTabComponent, mockQuoteService: any, mockUserCan: any, mockDialogService: any, mockRouter: any;

    beforeEach(() => {

      mockQuoteService = {
        data: Observable.of({ data: {} }),
        state: { data: { projects: [], total: 1759.824, discount: undefined } },
        getPaymentOptions: jasmine.createSpy('getPaymentOptions'),
        retrieveLicenseAgreements: jasmine.createSpy('retrieveLicenseAgreements').and.returnValue(Observable.of({})),
        mockRouter: { navigate: jasmine.createSpy('navigate') }
      };

      mockUserCan = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton')
      };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog'),
        openConfirmationDialog: jasmine.createSpy('openConfirmationDialog')
      };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      componentUnderTest = new QuoteTabComponent(mockQuoteService, mockUserCan, mockDialogService, mockRouter);
    });

    describe('checkout()', () => {
      it('should go to the next tab', () => {
        spyOn(componentUnderTest, 'goToNextTab');
        componentUnderTest.checkout();

        expect(componentUnderTest.goToNextTab).toHaveBeenCalled();
      });

      it('should retrieve the payment options', () => {
        componentUnderTest.checkout();

        expect(mockQuoteService.getPaymentOptions).toHaveBeenCalled();
      });
    });

    describe('shouldShowLicenseDetailsBtn()', () => {
      it('should cal viewLicenseAgreementsButton on the commerce capabilities', () => {
        let res: boolean = componentUnderTest.shouldShowLicenseDetailsBtn;

        expect(mockUserCan.viewLicenseAgreementsButton).toHaveBeenCalled();
      });
    });

    describe('showLicenseAgreements()', () => {
      it('should call retrieveLicenseAgreements() on the cart service', () => {
        componentUnderTest.showLicenseAgreements();

        expect(mockQuoteService.retrieveLicenseAgreements).toHaveBeenCalled();
      });
    });

    describe('showExpireConfirmationDialog', () => {
      it('should call openConfirmationDialog() on the dialog serice', () => {
        componentUnderTest.showExpireConfirmationDialog();
      });
    });

    describe('openRejectQuoteDialog()', () => {
      it('should call openConfirmationDialog() on the dialog service', () => {
        componentUnderTest.openRejectQuoteDialog();

        expect(mockDialogService.openConfirmationDialog).toHaveBeenCalled();
      });
    });

    describe('hasDiscount()', () => {
      it('should return false when discount does NOT exists', () => {
        expect(componentUnderTest.hasDiscount).toBe(false);
      });

      it('should return true if discount has a value', () => {
        let mockState = { data: { discount: 12.0 } };

        mockQuoteService = {
          data: Observable.of({ data: {} }),
          state: mockState,
        };
        componentUnderTest = new QuoteTabComponent(mockQuoteService, null, null, null);
        expect(componentUnderTest.hasDiscount).toBe(true);
      });
    });
  });
}
