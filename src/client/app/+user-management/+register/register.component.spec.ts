import { Observable } from 'rxjs/Observable';
import { RegisterComponent } from './register.component';
import { Response, ResponseOptions } from '@angular/http';

const user: any = {
  emailAddress: 'jamesbonline@yahoo.com', firstName: 'james',
  lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f'
};
export function main() {
  describe('Register Component', () => {
    let mockUiConfig: any, mockUserService: any, mockDialogService: any, mockRef: any;
    let componentUnderTest: RegisterComponent;
    beforeEach(() => {
      mockRef = { markForCheck: function () { } };
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUserService = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of(user)),
        downloadActiveTosDocument: jasmine.createSpy('downloadActiveTosDocument').and.returnValue(Observable.of('some-terms'))
      };
      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({}))
      };
      componentUnderTest = new RegisterComponent(mockUserService, mockUiConfig, mockDialogService, mockRef);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        spyOn(componentUnderTest, 'downloadTos');
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
        expect(componentUnderTest.downloadTos).toHaveBeenCalled();
      });
    });

    describe('onSubmit()', () => {
      it('Calls the server with user body to create user', () => {
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.user.create).toHaveBeenCalledWith(user);
      });

      it('Sets a component variable flag to show a success dialog to user', () => {
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.successfullySubmitted).toEqual(true);
      });

      it('Assigns success user response to instance variable for screen display', () => {
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.newUser).toEqual(user);
      });

      it('Sets a errors variable to display errors if the server doesnt pass', () => {
        const errorResponse: Response = new Response(new ResponseOptions({ body: JSON.stringify({ email: 'Not Unique' }) }));
        mockUserService = { create: jasmine.createSpy('create').and.returnValue(Observable.throw(errorResponse)) };
        componentUnderTest = new RegisterComponent(mockUserService, mockUiConfig, mockDialogService, mockRef);
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.serverErrors).toEqual({ email: 'Not Unique' });
      });

      it('Does not set errors variable if the status was 451', () => {
        const errorResponse: Response = new Response(
          new ResponseOptions({ status: 451, body: JSON.stringify({ email: 'Not Unique' }) })
        );
        mockUserService = { create: jasmine.createSpy('create').and.returnValue(Observable.throw(errorResponse)) };
        componentUnderTest = new RegisterComponent(mockUserService, mockUiConfig, mockDialogService, mockRef);
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.serverErrors).toEqual(null);
      });
    });

    describe('openTermsDialog()', () => {
      it('opens the component in the dialog service', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.openTermsDialog();
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalledWith({
          componentType: jasmine.any(Function),
          inputOptions: {
            terms: 'some-terms',
            btnLabel: 'REGISTER.CLOSE_TOS_DIALOG',
            header: 'REGISTER.TOS_TITLE'
          }
        });
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new RegisterComponent(mockUserService, mockUiConfig, mockDialogService, mockRef);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
