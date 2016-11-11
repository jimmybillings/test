import { Observable } from '../../imports/test.imports';
import { LoginComponent } from './login.component';

export function main() {

  describe('Login Component', () => {

    let mockUiConfig: any, mockAuthentication: any, mockRouter: any, mockCurrentUser: any,
        mockDocumentService: any, mockActivatedRoute: any;
    let componentUnderTest: LoginComponent;

    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockAuthentication = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of({ user: 'james', token: { token: 'loginToken' }, userPreferences: { pref: 1 } }))
      };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockDocumentService = { downloadActiveTosDocument: jasmine.createSpy('downloadActiveTosDocument'), agreeUserToTerms: jasmine.createSpy('agreeUserToTerms') };
      mockActivatedRoute = { params: Observable.of({}) };
      componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
      });

      it('Should display a message for a new user', () => {
        mockActivatedRoute = { params: Observable.of({newUser: 'true'}) };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute);
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
        expect(mockCurrentUser.set).toHaveBeenCalledWith('james', 'loginToken');
      });

      it('Navigates to the home page', () => {
        componentUnderTest.onSubmit({ 'user': 'james' });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });

      it('Shows the dialog if the user needs to agree to TOS', () => {
        mockAuthentication = {
          create: jasmine.createSpy('create').and.returnValue(
            Observable.of({ user: 'james', token: { token: 'loginToken' }, userPreferences: { pref: 1 }, documentsRequiringAgreement: ['TOS'] }))
        };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute);
        componentUnderTest.termsDialog = { show: jasmine.createSpy('show')};
        componentUnderTest.onSubmit({ 'user': 'ross' });
        expect(componentUnderTest.termsDialog.show).toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new LoginComponent(mockAuthentication, mockRouter, mockCurrentUser, mockDocumentService, mockUiConfig, mockActivatedRoute);
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
