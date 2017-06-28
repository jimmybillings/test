import { CartTabComponent } from './cart-tab.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Cart Tab Component', () => {
    let componentUnderTest: CartTabComponent, mockUserCan: any, mockCartService: any, mockDialogService: any;

    beforeEach(() => {
      mockUserCan = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton')
      };

      mockCartService = {
        getPaymentOptions: jasmine.createSpy('createPaymentOptions'),
        retrieveLicenseAgreements: jasmine.createSpy('retrieveLicenseAgreements').and.returnValue(Observable.of({}))
      };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog')
      };

      componentUnderTest = new CartTabComponent(
        mockUserCan, mockCartService, null, mockDialogService, null,
        null, null, null, null, null, null, null, null
      );
    });

    describe('checkout()', () => {
      it('should go to the next tab', () => {
        spyOn(componentUnderTest, 'goToNextTab');
        componentUnderTest.checkout();

        expect(componentUnderTest.goToNextTab).toHaveBeenCalled();
      });

      it('should retrieve the payment options', () => {
        componentUnderTest.checkout();

        expect(mockCartService.getPaymentOptions).toHaveBeenCalled();
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

        expect(mockCartService.retrieveLicenseAgreements).toHaveBeenCalled();
      });
    });
  });
}
