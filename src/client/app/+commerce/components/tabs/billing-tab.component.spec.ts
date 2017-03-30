import { BillingTabComponent } from './billing-tab.component';
import { Address, ViewAddress } from '../../../shared/interfaces/user.interface';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Billing Tab Component', () => {
    let componentUnderTest: BillingTabComponent;
    let mockCartService: any, mockUiConfig: any, mockUserService: any, mockDialog: any, mockCurrentUserService: any;
    let mockUserAccountPermission: boolean;

    let mockEmptyAddress: ViewAddress = {
      type: '',
      name: '',
      addressEntityId: NaN,
      defaultAddress: false
    };

    let mockAddressA: ViewAddress = {
      type: 'user',
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
      type: 'account',
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
          cart: { itemCount: 1, projects: [] },
          orderInProgress: { selectedAddress: mockAddressA, addresses: [mockAddressA, mockAddressB] }
        }),
        determineNewSelectedAddress: jasmine.createSpy('determineNewSelectedAddress'),
        updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: ['1', '2', '3'] } } }))
      };

      mockUserService = {
        getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Observable.of({ list: [mockAddressA, mockAddressB] })),
        addBillingAddress: jasmine.createSpy('addBillingAddress').and.returnValue(Observable.of({})),
        addAccountBillingAddress: jasmine.createSpy('addAccountBillingAddress').and.returnValue(Observable.of({}))
      };

      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({
          afterClosed: jasmine.createSpy('afterClosed').and.returnValue(Observable.of({})),
          componentInstance: {}
        }),
      };

      mockCurrentUserService = {
        state: { purchaseOnCredit: true }
      };

      componentUnderTest = new BillingTabComponent(
        null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, mockDialog
      );
    });

    describe('ngOnInit()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should set up an observable of the cart store orderInProgress', () => {
        componentUnderTest.orderInProgress.take(1).subscribe((data: any) => {
          expect(data).toEqual({
            selectedAddress: mockAddressA, addresses: [mockAddressA, mockAddressB]
          });
        });
      });

      it('should set up the form items from the uiConfig', () => {
        expect(componentUnderTest.items).toEqual(['1', '2', '3']);
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

          expect(mockDialog.open).toHaveBeenCalled();
          expect(mockUserService.addBillingAddress).toHaveBeenCalled();
        });

        it('should open a dialog and call addUserAddress if mode is "create"', () => {
          componentUnderTest.openFormFor('user', 'create');

          expect(mockDialog.open).toHaveBeenCalled();
          expect(mockUserService.addBillingAddress).toHaveBeenCalled();
        });
      });

      describe('account', () => {
        it('should open a dialog and call addAccountBillingAddress if mode is "edit"', () => {
          componentUnderTest.openFormFor('account', 'edit', mockAddressB);

          expect(mockDialog.open).toHaveBeenCalled();
          expect(mockUserService.addAccountBillingAddress).toHaveBeenCalled();
        });

        it('should open a dialog and call addAccountBillingAddress if mode is "create"', () => {
          componentUnderTest.openFormFor('account', 'create');

          expect(mockDialog.open).toHaveBeenCalled();
          expect(mockUserService.addAccountBillingAddress).toHaveBeenCalled();
        });
      });
    });

    describe('addressesAreEmpty', () => {
      it('should return true if the addresses are empty', () => {
        let mockStore: any = {
          orderInProgress: {
            addresses: [{ type: '', name: '' }, { type: '', name: '' }],
            selectedAddress: { type: '', name: '' }
          }
        };
        mockCartService = {
          data: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new BillingTabComponent(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.addressesAreEmpty.take(1).subscribe((data: any) => {
          expect(data).toBe(true);
        });
      });

      it('should return false if there is at least one full address', () => {
        let mockStore: any = { orderInProgress: { addresses: [mockAddressA], selectedAddress: mockAddressA } };
        mockCartService = {
          data: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new BillingTabComponent(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.addressesAreEmpty.take(1).subscribe((data: any) => {
          expect(data).toBe(false);
        });
      });
    });

    describe('get userCanProceed()', () => {
      it('should return false if the selectedAddress has no values', () => {
        let mockAddress: any = { type: 'user', address: { address: '', state: '' } };
        let mockStore: any = { orderInProgress: { addresses: [mockAddressA], selectedAddress: mockAddress } };
        mockCartService = {
          data: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new BillingTabComponent(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.userCanProceed.take(1).subscribe((data: any) => {
          expect(data).toBe(false);
        });
      });

      it('should return true if there is a selectedAddress with all values', () => {
        let mockAddress: any = { type: 'user', address: { address: 'b', state: 'a' } };
        let mockStore: any = { orderInProgress: { addresses: [mockAddressA], selectedAddress: mockAddress } };
        mockCartService = {
          data: Observable.of(mockStore),
          updateOrderInProgress: jasmine.createSpy('updateOrderInProgress')
        };
        componentUnderTest = new BillingTabComponent(
          null, mockCartService, mockUiConfig, mockUserService, mockCurrentUserService, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.userCanProceed.take(1).subscribe((data: any) => {
          expect(data).toBe(true);
        });
      });
    });
  });
};
