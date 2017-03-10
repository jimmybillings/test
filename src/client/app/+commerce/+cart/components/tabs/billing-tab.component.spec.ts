import { BillingTabComponent } from './billing-tab.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Billing Tab Component', () => {
    let componentUnderTest: BillingTabComponent;
    let mockCartService: any, mockUiConfig: any, mockUserService: any, mockCartCapabilities: any, mockDialog: any;
    let mockUserAccountPermission: boolean;

    let mockAddressA: any = {
      type: 'user',
      name: 'Ross Edfort',
      address: {
        address: '123 Main Street',
        state: 'CO',
        city: 'Denver',
        country: 'USA',
        zipcode: '80202',
        phone: '5555555555',
        suburb: 'LoDo'
      }
    };

    let mockAddressB: any = {
      type: 'account',
      name: 'Wazee Digital',
      address: {
        address: '1515 Arapahoe Street',
        state: 'CO',
        city: 'Denver',
        country: 'USA',
        zipcode: '80202',
        phone: '5555555555',
        suburb: 'LoDo'
      }
    };

    beforeEach(() => {
      mockCartService = {
        data: Observable.of({ cart: { itemCount: 1, projects: [] }, orderInProgress: { address: mockAddressA } }),
        updateOrderInProgressAddress: jasmine.createSpy('updateOrderInProgressAddress')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: ['1', '2', '3'] } } }))
      };

      mockUserService = {
        getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Observable.of([mockAddressA, mockAddressB])),
        addBillingAddress: jasmine.createSpy('addBillingAddress').and.returnValue(Observable.of({}))
      };

      mockCartCapabilities = {
        editAccountBillingAddress: () => mockUserAccountPermission
      };

      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({
          afterClosed: jasmine.createSpy('afterClosed').and.returnValue(Observable.of({})),
          componentInstance: {}
        }),
      };

      componentUnderTest = new BillingTabComponent(
        mockCartCapabilities, mockCartService, mockUiConfig, mockUserService, mockDialog
      );
    });

    describe('ngOnInit()', () => {
      describe('with addresses', () => {
        beforeEach(() => {
          componentUnderTest.ngOnInit();
        });

        afterEach(() => {
          componentUnderTest.ngOnDestroy();
        });

        it('should set up a subscription to the cart store that updates the selectedAddress', () => {
          expect(componentUnderTest.selectedAddress).toEqual(mockAddressA);
        });

        it('should set up the form items from the uiConfig', () => {
          expect(componentUnderTest.items).toEqual(['1', '2', '3']);
        });

        it('should set up the user addresses', () => {
          expect(componentUnderTest.addresses).toEqual([mockAddressA, mockAddressB]);
        });

        it('should call updateOrderInProgressAddress to update the store with the first address in the array', () => {
          expect(mockCartService.updateOrderInProgressAddress).toHaveBeenCalledWith(mockAddressA);
        });
      });

      describe('without addresses', () => {
        beforeEach(() => {
          mockUserService = {
            getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Observable.of([]))
          };
          componentUnderTest = new BillingTabComponent(null, mockCartService, mockUiConfig, mockUserService, null);
          componentUnderTest.ngOnInit();
        });

        afterEach(() => {
          componentUnderTest.ngOnDestroy();
        });

        it('should not call updateOrderInProgressAddress', () => {
          expect(mockCartService.updateOrderInProgressAddress).not.toHaveBeenCalled();
        });
      });
    });

    describe('addUserAddress()', () => {
      it('should call addBillingAddress() on the user service', () => {
        componentUnderTest.addUserAddress(mockAddressA);

        expect(mockUserService.addBillingAddress).toHaveBeenCalledWith(mockAddressA);
      });

      it('should re-fetch the addresses', () => {
        componentUnderTest.addUserAddress(mockAddressA);

        expect(mockUserService.getAddresses).toHaveBeenCalled();
      });
    });

    describe('addAccountAddress()', () => {
      it('should do nothing for now', () => {
        spyOn(console, 'log');

        componentUnderTest.addAccountAddress(mockAddressA);

        expect(console.log).toHaveBeenCalled();
      });
    });

    describe('openAddressFormFor', () => {
      it('should open a dialog and call addAccountAddress if resourceType is "account"', () => {
        spyOn(componentUnderTest, 'addAccountAddress');
        componentUnderTest.selectedAddress = mockAddressA;
        componentUnderTest.openAddressFormFor('account', 'edit');

        expect(mockDialog.open).toHaveBeenCalled();
        expect(componentUnderTest.addAccountAddress).toHaveBeenCalled();
      });

      it('should open a dialog and call addUserAddress if resourceType is "user', () => {

      });
    });

    describe('get userCanEditAccountAddress()', () => {
      it('should return TRUE if the selectedAddress is of type "account" and the user can edit account addresses', () => {
        mockUserAccountPermission = true;
        componentUnderTest.selectedAddress = mockAddressB;

        expect(componentUnderTest.userCanEditAccountAddress).toBe(true);
      });

      it('should return FALSE if the selectedAddress is not of type "account"', () => {
        mockUserAccountPermission = true;
        componentUnderTest.selectedAddress = mockAddressA;

        expect(componentUnderTest.userCanEditAccountAddress).toBe(false);
      });

      it('should return FALSE if the user does not have permission', () => {
        mockUserAccountPermission = false;
        componentUnderTest.selectedAddress = mockAddressB;

        expect(componentUnderTest.userCanEditAccountAddress).toBe(false);
      });
    });

    describe('get onlyAccountADdressesExist()', () => {
      it('should return true if only addresses of type "account" exist', () => {
        componentUnderTest.addresses = [mockAddressB];

        expect(componentUnderTest.onlyAccountAddressesExist).toBe(true);
      });

      it('should return false if there are addresses of type "user"', () => {
        componentUnderTest.addresses = [mockAddressA, mockAddressB];

        expect(componentUnderTest.onlyAccountAddressesExist).toBe(false);
      });
    });

    describe('get userCanProceed()', () => {
      it('should return false if there is no selectedAddress', () => {
        expect(componentUnderTest.selectedAddress).toBeUndefined();
        expect(componentUnderTest.userCanProceed).toBe(false);
      });

      it('should return true if there is a selectedAddress', () => {
        componentUnderTest.selectedAddress = mockAddressA;
        expect(componentUnderTest.userCanProceed).toBe(true);
      });
    });
  });
};
