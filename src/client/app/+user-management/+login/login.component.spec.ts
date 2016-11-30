import { Observable } from '../../imports/test.imports';
import { LoginComponent } from './login.component';

export function main() {

  describe('Login Component', () => {
    (<any>window).pendo = { initialize: jasmine.createSpy('initialize') };
    let mockUiConfig: any, mockAuthentication: any, mockRouter: any, mockCurrentUser: any,
        mockDocumentService: any, mockActivatedRoute: any, mockPendo: any, mockSearchContext: any,
        mockUserPreference: any;
    let componentUnderTest: LoginComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockAuthentication = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of({
          user: { firstName: 'james', lastName: 'billings', siteName: 'core', id: 10 },
          token: { token: 'loginToken' },
          userPreferences: { pref: 1 }
        }))
      };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockDocumentService = { downloadActiveTosDocument: jasmine.createSpy('downloadActiveTosDocument'), agreeUserToTerms: jasmine.createSpy('agreeUserToTerms') };
      mockActivatedRoute = { params: Observable.of({}) };
      mockPendo = { initialize: jasmine.createSpy('initialize') };
      mockSearchContext = { update: '' };
      mockUserPreference = { updateSortPreference: jasmine.createSpy('updateSortPreference') };
      componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute, mockPendo, mockSearchContext, mockUserPreference);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });

      it('Should display a message for a new user', () => {
        mockActivatedRoute = { params: Observable.of({newUser: 'true'}) };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute, mockPendo, mockSearchContext, mockUserPreference);
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.firstTimeUser).toBe(true);
      });
    });

    describe('onSubmit()', () => {
      it('Submits a set new password request', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockAuthentication.create).toHaveBeenCalledWith({ 'user': 'james' });
      });

      it('Sets a new user and auth token on response', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockCurrentUser.set).toHaveBeenCalledWith({ firstName: 'james', lastName: 'billings', siteName: 'core', id: 10 }, 'loginToken');
      });

      it('Navigates to the home page', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });

      it('Shows the dialog if the user needs to agree to TOS', () => {
        mockAuthentication = {
          create: jasmine.createSpy('create').and.returnValue(
            Observable.of({
              user: { firstName: 'james', lastName: 'billings', siteName: 'core', id: 10 },
              token: { token: 'loginToken' },
              userPreferences: { pref: 1 },
              documentsRequiringAgreement: ['TOS']
            }))
        };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute, mockPendo, mockSearchContext, mockUserPreference);
        componentUnderTest.termsDialog = { show: jasmine.createSpy('show')};
        componentUnderTest.onSubmit({ 'user': 'ross' });
        expect(componentUnderTest.termsDialog.show).toHaveBeenCalled();
      });

      it('initialize pendo if the site is commerce', () => {
        (<any>window).portal = 'commerce';
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockPendo.initialize).toHaveBeenCalledWith({ firstName: 'james', lastName: 'billings', siteName: 'core', id: 10 });
        (<any>window).portal = 'core';
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute, mockPendo, mockSearchContext, mockUserPreference);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('agreeToTerms()', () => {
      it('calls the service and navigates', () => {
        componentUnderTest.agreeToTermsAndClose();

        expect(mockDocumentService.agreeUserToTerms).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalled();
      });
    });

  });
}
