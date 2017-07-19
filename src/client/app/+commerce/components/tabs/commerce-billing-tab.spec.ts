import { CommerceBillingTab } from './commerce-billing-tab';
import { Address, ViewAddress } from '../../../shared/interfaces/user.interface';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Billing Tab Component', () => {
    let componentUnderTest: CommerceBillingTab;
    let mockCartService: any, mockUiConfig: any, mockUserService: any, mockDialogService: any, mockCurrentUserService: any;
    let mockUserAccountPermission: boolean, mockRef: any;

    let mockEmptyAddress: ViewAddress = {
      type: null,
      name: '',
      addressEntityId: NaN,
      defaultAddress: false
    };

    let mockAddressA: ViewAddress = {
      type: 'User',
      name: 'Ross Edfort',
      addressEntityId: 10,
      defaultAddress: false,
      address: {
        address: '123 Main Street',
        state: 'CO',
        city: 'Denver',
        country: 'USA',
        zipcode: '80202',
        phone: '5555555555'
      }
    };

    let mockAddressB: ViewAddress = {
      type: 'Account',
      name: 'Wazee Digital',
      addressEntityId: 1,
      defaultAddress: false,
      address: {
        address: '1515 Arapahoe Street',
        state: 'CO',
        city: 'Denver',
        country: 'USA',
        zipcode: '80202',
        phone: '5555555555'
      }
    };

    beforeEach(() => {
      mockCartService = {
        data: Observable.of({
          cart: { itemCount: 1, projects: [] }
        }),
        checkoutData: Observable.of({ selectedAddress: mockAddressA, addresses: [mockAddressA, mockAddressB] }),
        checkoutState: { selectedAddress: mockAddressA, addresses: [mockAddressA, mockAddressB] },
        determineNewSelectedAddress: jasmine.createSpy('determineNewSelectedAddress'),
        updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ name: '', value: '' }] } } }))
      };

      mockUserService = {
        getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Observable.of([mockAddressA, mockAddressB])),
        addBillingAddress: jasmine.createSpy('addBillingAddress').and.returnValue(Observable.of({})),
        addAccountBillingAddress: jasmine.createSpy('addAccountBillingAddress').and.returnValue(Observable.of({}))
      };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({ data: 'Test data' })),
      };

      mockCurrentUserService = {
        state: { purchaseOnCredit: true }
      };

      mockRef = { detectChanges: jasmine.createSpy('detectChanges') };

      componentUnderTest = new CommerceBillingTab(
        null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, mockDialogService, mockRef
      );
    });

    describe('ngOnInit()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should set up an observable of the orderInProgress', () => {
        componentUnderTest.orderInProgress.take(1).subscribe((data: any) => {
          expect(data).toEqual({
            selectedAddress: mockAddressA, addresses: [mockAddressA, mockAddressB]
          });
        });
      });

      it('should set up the form items from the uiConfig', () => {
        expect(componentUnderTest.items).toEqual([{ name: '', value: '' }]);
      });
    });


    describe('addUserAddress()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should call addBillingAddress() on the user service', () => {
        componentUnderTest.addUserAddress(mockAddressA.address);

        expect(mockUserService.addBillingAddress).toHaveBeenCalledWith(mockAddressA.address);
      });

      it('should re-fetch the addresses', () => {
        componentUnderTest.addUserAddress(mockAddressA.address);

        expect(mockUserService.getAddresses).toHaveBeenCalled();
      });
    });

    describe('addAccountAddress()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should call addAccountBillingAddress() on the user service', () => {
        componentUnderTest.addAccountAddress(mockAddressB.address, mockAddressA);

        let newAddress: ViewAddress = Object.assign({}, mockAddressA, { address: mockAddressB.address });

        expect(mockUserService.addAccountBillingAddress).toHaveBeenCalledWith(newAddress);
      });
    });

    describe('openFormFor', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('user', () => {
        it('should open a dialog and call addBillingAddress if mode is "edit"', () => {
          componentUnderTest.openFormFor('user', 'edit', mockAddressB);

          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });

        it('should open a dialog and call addUserAddress if mode is "create"', () => {
          componentUnderTest.openFormFor('user', 'create');

          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });

      describe('account', () => {
        it('should open a dialog and call addAccountBillingAddress if mode is "edit"', () => {
          componentUnderTest.openFormFor('account', 'edit', mockAddressB);

          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });

        it('should open a dialog and call addAccountBillingAddress if mode is "create"', () => {
          componentUnderTest.openFormFor('account', 'create');

          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });
    });

    describe('displayAddressErrors()', () => {
      it('should return true when the address has errors', () => {
        componentUnderTest.addressErrors = { 123: ['city'] };
        expect(componentUnderTest.displayAddressErrors(123)).toBe(true);
      });

      it('should return false when the address does not have errors', () => {
        componentUnderTest.addressErrors = { 123: [] };
        expect(componentUnderTest.displayAddressErrors(123)).toBe(false);
      });
    });

    describe('formatAddressErrors()', () => {
      it('should return the right string for 1 error', () => {
        componentUnderTest.addressErrors = { 10: ['city'] };
        expect(componentUnderTest.formatAddressErrors(mockAddressA)).toBe('city');
      });

      it('should return the right string for 2 errors', () => {
        componentUnderTest.addressErrors = { 10: ['city', 'state'] };
        expect(componentUnderTest.formatAddressErrors(mockAddressA)).toBe('city, and state');
      });

      it('should return the right string for more than 2 errors', () => {
        componentUnderTest.addressErrors = { 10: ['city', 'state', 'phone', 'zipcode'] };
        expect(componentUnderTest.formatAddressErrors(mockAddressA)).toBe('city, state, phone, and zipcode');
      });
    });

    describe('get userCanProceed()', () => {
      it('should return false if the selectedAddress has no values', () => {
        let mockAddress: any = { type: 'user', address: { address: '', state: '' } };
        let mockStore: any = { addresses: [mockAddressA], selectedAddress: mockAddress };
        mockCartService = {
          data: Observable.of({}),
          checkoutData: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new CommerceBillingTab(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null, mockRef
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.userCanProceed.take(1).subscribe((data: any) => {
          expect(data).toBe(false);
        });
      });

      it('should return true if there is a selectedAddress with all values', () => {
        let mockAddress: any = { type: 'user', address: { address: 'b', state: 'a' } };
        let mockStore: any = { addresses: [mockAddressA], selectedAddress: mockAddress };
        mockCartService = {
          data: Observable.of({}),
          checkoutData: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new CommerceBillingTab(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null, mockRef
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.userCanProceed.take(1).subscribe((data: any) => {
          expect(data).toBe(true);
        });
      });
    });
  });
};
