import { Observable } from '../../imports/test.imports';
import { ResetPasswordComponent } from './reset-password.component';
import { Response, ResponseOptions } from '@angular/http';

export function main() {
  describe('Reset Password Component', () => {
    let mockUiConfig: any, mockUser: any, mockActivatedRoute: any, mockRouter: any,
      mockCurrentUser: any, mockNotification: any, mockTranslate: any, mockSnackbar: any;
    let componentUnderTest: ResetPasswordComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUser = {
        resetPassword: jasmine.createSpy('reset_password').and.returnValue(
          Observable.of({ user: 'james', token: { token: 'loginToken' }, userPreferences: { pref: 1 } }))
      };
      mockActivatedRoute = { snapshot: { params: { share_key: 'sldkjf2938sdlkjf289734' } } };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of('translation'))
      };
      mockSnackbar = { open: jasmine.createSpy('open') };
      componentUnderTest = new ResetPasswordComponent(
        mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
        mockCurrentUser, mockTranslate, mockSnackbar
      );
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit() success', () => {
      it('Submits a set new password request', () => {
        componentUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
        expect(mockUser.resetPassword).toHaveBeenCalledWith({ 'newPassword': 'myNewTestPassword' }, 'sldkjf2938sdlkjf289734');
      });

      it('Sets a new user and auth token on response', () => {
        componentUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
        expect(mockCurrentUser.set).toHaveBeenCalledWith('james', 'loginToken');
      });


      it('Navigates to the home page', () => {
        componentUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });

      it('Displays a snackbar that the password was sucessfully changed', () => {
        componentUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
        expect(mockTranslate.get).toHaveBeenCalledWith('RESETPASSWORD.PASSWORD_CHANGED');
        expect(mockSnackbar.open).toHaveBeenCalledWith('translation', '', { duration: 2000 });
      });
    });

    describe('onSubmit() error', () => {
      it('Sets a errors variable to display errors if the server doesnt pass', () => {
        const errorResponse: Response = new Response(new ResponseOptions(
          { body: JSON.stringify({ newPassword: 'Needs a number and letter' }) }));
        mockUser = {
          resetPassword: jasmine.createSpy('resetPassword').and.returnValue(
            Observable.throw(errorResponse))
        };
        componentUnderTest = new ResetPasswordComponent(
          mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
          mockCurrentUser, mockTranslate, mockSnackbar
        );
        componentUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
        expect(componentUnderTest.serverErrors).toEqual({ newPassword: 'Needs a number and letter' });
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new ResetPasswordComponent(
          mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
          mockCurrentUser, mockTranslate, mockSnackbar
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

  });
}
