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
        phone: '5555555555'
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
        phone: '5555555555'
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
        getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Observable.of({ list: [mockAddressA, mockAddressB] })),
        addBillingAddress: jasmine.createSpy('addBillingAddress').and.returnValue(Observable.of({})),
        addAccountBillingAddress: jasmine.createSpy('addAccountBillingAddress').and.returnValue(Observable.of({}))
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
      });

      describe('without addresses', () => {
        beforeEach(() => {
          mockCartService = {
            data: Observable.of({ cart: { itemCount: 1, projects: [] }, orderInProgress: { address: { type: '' } } }),
            updateOrderInProgressAddress: jasmine.createSpy('updateOrderInProgressAddress')
          };

          componentUnderTest = new BillingTabComponent(
            mockCartCapabilities, mockCartService, mockUiConfig, mockUserService, mockDialog
          );

          componentUnderTest.ngOnInit();
        });

        afterEach(() => {
          componentUnderTest.ngOnDestroy();
        });

        it('should call updateOrderInProgressAddress to update the store with the first address in the array', () => {
          expect(mockCartService.updateOrderInProgressAddress).toHaveBeenCalledWith(mockAddressA);
        });
      });
    });

    describe('addUserAddress()', () => {
      beforeEach(() => {
        componentUnderTest.selectedAddress = mockAddressA;
      });

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
      it('should call addAccountBillingAddress() on the user service', () => {
        componentUnderTest.selectedAddress = mockAddressA;
        componentUnderTest.addAccountAddress(mockAddressA.address);

        expect(mockUserService.addAccountBillingAddress).toHaveBeenCalledWith(mockAddressA);
      });
    });

    describe('format', () => {
      it('should format an address object to a string', () => {
        expect(componentUnderTest.format(mockAddressA)).toEqual('123 Main Street, CO, Denver, USA, 80202, 5555555555');
      });

      it('should return a default string when no address exists', () => {
        let incompleteAddress: any = { type: 'user' };
        expect(componentUnderTest.format(incompleteAddress)).toEqual('There is no address on record for this user');
      });
    });

    describe('openAddressFormFor', () => {
      it('should open a dialog and call addAccountAddress if resourceType is "account"', () => {
        componentUnderTest.selectedAddress = mockAddressB;
        componentUnderTest.openAddressFormFor('account', 'edit', mockAddressB);

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockUserService.addAccountBillingAddress).toHaveBeenCalled();
      });

      it('should open a dialog and call addUserAddress if resourceType is "user"', () => {
        componentUnderTest.selectedAddress = mockAddressA;
        componentUnderTest.openAddressFormFor('user', 'edit', mockAddressB);

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockUserService.addBillingAddress).toHaveBeenCalled();
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
