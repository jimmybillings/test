import { Observable } from '../../imports/test.imports';
import { ForgotPasswordComponent } from './forgot-password.component';

export function main() {
  describe('Forgot Password Component', () => {
    let mockUiConfig: any, mockUser: any;
    let componentUnderTest: ForgotPasswordComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUser = { forgotPassword: jasmine.createSpy('forgotPassword').and.returnValue(Observable.of({})) };
      componentUnderTest = new ForgotPasswordComponent(mockUser, mockUiConfig);
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

  });
}
