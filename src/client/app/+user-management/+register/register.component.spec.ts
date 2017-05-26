import { Observable } from 'rxjs/Observable';
import { RegisterComponent } from './register.component';
import { Response, ResponseOptions } from '@angular/http';

const user: any = {
  emailAddress: 'jamesbonline@yahoo.com', firstName: 'james',
  lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f'
};
export function main() {
  describe('Register Component', () => {
    let mockUiConfig: any, mockUser: any, mockRef: any;
    let componentUnderTest: RegisterComponent;
    beforeEach(() => {
      mockRef = { markForCheck: function () { } };
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
      mockUser = { create: jasmine.createSpy('create').and.returnValue(Observable.of(user)) };
      componentUnderTest = new RegisterComponent(mockUser, mockUiConfig, null, mockRef);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ someConfig: 'test' });
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
        mockUser = { create: jasmine.createSpy('create').and.returnValue(Observable.throw(errorResponse)) };
        componentUnderTest = new RegisterComponent(mockUser, mockUiConfig, null, mockRef);
        componentUnderTest.onSubmit(user);
        expect(componentUnderTest.serverErrors).toEqual({ email: 'Not Unique' });
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new RegisterComponent(mockUser, mockUiConfig, null, mockRef);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
