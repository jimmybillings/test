import { ProfileComponent } from './profile.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Profile Component', () => {

    let mockCurrentUserService: any;
    let componentUnderTest: ProfileComponent;
    const user: any = {
      emailAddress: 'jamesbonline@yahoo.com',
      firstName: 'james', lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f'
    };

    beforeEach(() => {
      mockCurrentUserService = { data: Observable.of(user) };
      componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.user).toEqual(user);
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockCurrentUserService = { data: mockObservable };
        componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
