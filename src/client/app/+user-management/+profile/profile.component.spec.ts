import { ProfileComponent } from './profile.component';
import { Observable } from '../../imports/test.imports';

export function main() {
  describe('Profile Component', () => {

    let mockCurrentUser: any;
    let componentUnderTest: ProfileComponent;
    const user: any = {
      emailAddress: 'jamesbonline@yahoo.com',
      firstName: 'james', lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f'
    };

    beforeEach(() => {
      mockCurrentUser = { data: Observable.of(user) };
      componentUnderTest = new ProfileComponent(mockCurrentUser, null);
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
        mockCurrentUser = { data: mockObservable };
        componentUnderTest = new ProfileComponent(mockCurrentUser, null);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
