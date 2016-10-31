import { Observable } from '../../imports/test.imports';
import { LoginComponent } from './login.component';

export function main() {

  describe('Login Component', () => {

    let mockUiConfig: any, mockAuthentication: any, mockRouter: any, mockCurrentUser: any, mockUserPreference: any;
    let componentUnderTest: LoginComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockAuthentication = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of({ user: 'james', token: { token: 'loginToken' }, userPreferences: { pref: 1 } }))
      };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockUserPreference = { set: jasmine.createSpy('set') };
      componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockUserPreference, mockUiConfig);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit()', () => {
      it('Submits a set new password request', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockAuthentication.create).toHaveBeenCalledWith({ 'user': 'james' });
      });

      it('Sets a new user and auth token on response', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockCurrentUser.set).toHaveBeenCalledWith('james', 'loginToken');
      });

      it('Navigates to the home page', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockUserPreference, mockUiConfig);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

  });
}
