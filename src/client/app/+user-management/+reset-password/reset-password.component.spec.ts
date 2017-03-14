import { Observable } from '../../imports/test.imports';
import { ResetPasswordComponent } from './reset-password.component';
import { Response, ResponseOptions } from '@angular/http';

export function main() {
  describe('Reset Password Component', () => {
    let mockUiConfig: any, mockUser: any, mockActivatedRoute: any, mockRouter: any, mockRef: any,
      mockCurrentUserService: any, mockNotification: any, mockTranslate: any, mockSnackbar: any;
    let componentUnderTest: ResetPasswordComponent;

    beforeEach(() => {
      mockRef = { markForCheck: function () { } };
      mockUiConfig = {
        get: () => { return Observable.of({ config: { someConfig: 'test' } }); }
      };
      mockUser = {
        resetPassword: jasmine.createSpy('resetPassword').and.returnValue(
          Observable.of({
            user: 'james',
            token: { token: 'loginToken' },
            userPreferences: { pref: 1 }
          })
        ),
        changePassword: jasmine.createSpy('changePassword').and.returnValue(
          Observable.of({})
        )
      };
      mockActivatedRoute = {
        snapshot: { params: { share_key: 'sldkjf2938sdlkjf289734' } }
      };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUserService = {
        set: jasmine.createSpy('set'),
        loggedIn: jasmine.createSpy('loggedIn').and.returnValue(true)
      };
      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of('translation'))
      };
      mockSnackbar = { open: jasmine.createSpy('open') };
      componentUnderTest = new ResetPasswordComponent(
        mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
        mockCurrentUserService, mockTranslate, mockSnackbar, mockRef
      );
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit() success', () => {
      describe('with a share token', () => {
        beforeEach(() => {
          componentUnderTest.ngOnInit();
        });

        it('calls resetPassword()', () => {
          componentUnderTest.onSubmit({ newPassword: 'myNewTestPassword' });
          expect(mockUser.resetPassword).toHaveBeenCalledWith({ newPassword: 'myNewTestPassword' }, 'sldkjf2938sdlkjf289734');
        });

        it('Sets a new user and auth token on response', () => {
          componentUnderTest.onSubmit({ newPassword: 'myNewTestPassword' });
          expect(mockCurrentUserService.set).toHaveBeenCalledWith('james', 'loginToken');
        });


        it('Navigates to the home page', () => {
          componentUnderTest.onSubmit({ newPassword: 'myNewTestPassword' });
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        });

        it('Displays a snackbar that the password was sucessfully changed', () => {
          componentUnderTest.onSubmit({ newPassword: 'myNewTestPassword' });
          expect(mockTranslate.get).toHaveBeenCalledWith('RESETPASSWORD.PASSWORD_CHANGED');
          expect(mockSnackbar.open).toHaveBeenCalledWith('translation', '', { duration: 2000 });
        });
      });

      describe('without a share key', () => {
        beforeEach(() => {
          mockActivatedRoute = { snapshot: { params: {} } };
          componentUnderTest = new ResetPasswordComponent(
            mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
            mockCurrentUserService, mockTranslate, mockSnackbar, mockRef
          );
          componentUnderTest.ngOnInit();
        });
        it('calls changePassword()', () => {
          componentUnderTest.onSubmit({ newPassword: 'abc123' });

          expect(mockUser.changePassword).toHaveBeenCalledWith({ newPassword: 'abc123' });
        });
      });
    });

    describe('onSubmit() error', () => {
      it('Sets a errors variable to display errors if the server doesnt pass', () => {
        const errorResponse: Response = new Response(new ResponseOptions(
          { body: JSON.stringify({ newPassword: 'Needs a number and letter' }) }));
        mockUser = {
          resetPassword: jasmine.createSpy('resetPassword').and.returnValue(
            Observable.throw(errorResponse)),
          changePassword: jasmine.createSpy('resetPassword').and.returnValue(
            Observable.throw(errorResponse))
        };
        componentUnderTest = new ResetPasswordComponent(
          mockUser, mockUiConfig, mockActivatedRoute, mockRouter,
          mockCurrentUserService, mockTranslate, mockSnackbar, mockRef
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
          mockCurrentUserService, mockTranslate, mockSnackbar, mockRef
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

  });
}
