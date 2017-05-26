import { Observable } from 'rxjs/Observable';
import { ForgotPasswordComponent } from './forgot-password.component';

export function main() {
  describe('Forgot Password Component', () => {
    let mockUiConfig: any, mockUser: any, mockRef: any;
    let componentUnderTest: ForgotPasswordComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUser = { forgotPassword: jasmine.createSpy('forgotPassword').and.returnValue(Observable.of({})) };
      mockRef = { markForCheck: function () { } };
      componentUnderTest = new ForgotPasswordComponent(mockUser, mockUiConfig, mockRef);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit()', () => {
      it('Submits a request for a reset password email', () => {
        componentUnderTest.onSubmit({ 'emailAddress': 'test@test.com' });
        expect(componentUnderTest.user.forgotPassword).toHaveBeenCalledWith({ 'emailAddress': 'test@test.com' });
        expect(componentUnderTest.successfullySubmitted).toEqual(true);
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new ForgotPasswordComponent(mockUser, mockUiConfig, mockRef);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

  });
}
