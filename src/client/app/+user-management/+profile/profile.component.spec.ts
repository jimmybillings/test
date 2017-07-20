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

    describe('getBillingAddressInfo()', () => {
      let mockUser: any;
      it('should return an empty string when billingInfo does not exist on the user', () => {
        mockUser = {
          emailAddress: 'jdoe@gmail.com',
          firstName: 'John', lastName: 'Doe', password: '3978f324e14ac256b2994b754586e05f',
        };
        mockCurrentUserService = { data: Observable.of(mockUser) };
        componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.getBillingAddressInfo('state');
        expect(result).toBe('');
      });
      it('should return undefined when part of billingInfo.address exist but requested part is missing', () => {
        mockUser = {
          emailAddress: 'jdoe@gmail.com',
          firstName: 'John', lastName: 'Doe', password: '3978f324e14ac256b2994b754586e05f',
          emailOptOut: false,
          billingInfo: { address: { state: 'CO', phone: '720 291-2524' } },
        };
        mockCurrentUserService = { data: Observable.of(mockUser) };
        componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.getBillingAddressInfo('address');
        expect(result).toBeUndefined();
      });
      it('should return correct part of billingInfo address if it exists', () => {
        mockUser = {
          emailAddress: 'jdoe@gmail.com',
          firstName: 'John', lastName: 'Doe', password: '3978f324e14ac256b2994b754586e05f',
          emailOptOut: false,
          billingInfo: { address: { state: 'CO', phone: '720 291-2524' } },
        };
        mockCurrentUserService = { data: Observable.of(mockUser) };
        componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.getBillingAddressInfo('state');
        expect(result).toBe('CO');
      });
      it('should return empty string if billingInfo.address does not exist', () => {
        mockUser = {
          emailAddress: 'jdoe@gmail.com',
          emailOptOut: false,
          billingInfo: {},
        };
        mockCurrentUserService = { data: Observable.of(mockUser) };
        componentUnderTest = new ProfileComponent(mockCurrentUserService, null, null);
        componentUnderTest.ngOnInit();
        let result = componentUnderTest.getBillingAddressInfo('state');
        expect(result).toBe('');
      });
    });
  });
}
