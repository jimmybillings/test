import { QuoteTabComponent } from './quote-tab.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Tab Component', () => {
    let componentUnderTest: QuoteTabComponent, mockQuoteService: any, mockUserCan: any, mockDialogService: any;

    beforeEach(() => {
      mockQuoteService = {
        data: Observable.of({ data: {} }),
        getPaymentOptions: jasmine.createSpy('getPaymentOptions'),
        retrieveLicenseAgreements: jasmine.createSpy('retrieveLicenseAgreements').and.returnValue(Observable.of({}))
      };

      mockUserCan = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton')
      };

      mockDialogService = { openComponentInDialog: jasmine.createSpy('openComponentInDialog') };

      componentUnderTest = new QuoteTabComponent(mockQuoteService, mockUserCan, mockDialogService);
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
        componentUnderTest.shouldShowLicenseDetailsBtn();

        expect(mockUserCan.viewLicenseAgreementsButton).toHaveBeenCalled();
      });
    });

    describe('showLicenseAgreements()', () => {
      it('should call retrieveLicenseAgreements() on the cart service', () => {
        componentUnderTest.showLicenseAgreements();

        expect(mockQuoteService.retrieveLicenseAgreements).toHaveBeenCalled();
      });
    });
  });
}
