import { Observable } from '../../imports/test.imports';
import { ResetPasswordComponent } from './reset-password.component';

export function main() {
  describe('Reset Password Component', () => {
    let mockUiConfig: any, mockUser: any, mockActivatedRoute: any, mockRouter: any, mockCurrentUser: any, mockUserPreference: any;
    let componentUnderTest: ResetPasswordComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUser = {
        resetPassword: jasmine.createSpy('resetPassword').and.returnValue(Observable.of({ user: 'james', token: { token: 'loginToken' }, userPreferences: { pref: 1 } }))
      };
      mockActivatedRoute = { snapshot: { queryParams: { shareKey: 'sldkjf2938sdlkjf289734' } } };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockUserPreference = { set: jasmine.createSpy('set') };
      componentUnderTest = new ResetPasswordComponent(mockUser, mockUiConfig, mockActivatedRoute, mockRouter, mockCurrentUser, mockUserPreference);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit()', () => {
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
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new ResetPasswordComponent(mockUser, mockUiConfig, mockActivatedRoute, mockRouter, mockCurrentUser, mockUserPreference);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

  });
}
