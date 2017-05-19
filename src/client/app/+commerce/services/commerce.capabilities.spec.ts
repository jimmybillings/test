import { Observable } from 'rxjs/Observable';

import { CommerceCapabilities } from './commerce.capabilities';

export function main() {
  describe('Cart Capabilities', () => {
    let mockCurrentUserService: any;
    let mockUiState: any;
    let mockFeature: any;
    let capabilitiesUnderTest: CommerceCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature);
      mockCurrentUserService = {};
      mockUiState = {};
      mockFeature = {};
    });

    describe('viewCartIcon()', () => {
      let loggedIn: boolean;
      let permission: boolean;
      let headerIsExpanded: boolean;

      beforeEach(() => {
        mockCurrentUserService = { loggedIn: () => loggedIn, hasPermission: () => permission };
        mockUiState = { headerIsExpanded: () => Observable.of(headerIsExpanded) };
        mockFeature = { isAvailable: () => true };
      });

      it('returns observable of false when header not expanded and no permission', () => {
        loggedIn = true;
        headerIsExpanded = false;
        new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header is expanded but no permission', () => {
        loggedIn = false;
        headerIsExpanded = true;
        new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header not expanded but has permission', () => {
        loggedIn = false;
        headerIsExpanded = false;
        new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when header is expanded and has permission', () => {
        loggedIn = true;
        headerIsExpanded = true;
        new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('purchaseOnCredit()', () => {
      let hasPurchaseOnCredit: boolean;

      beforeEach(() => {
        mockCurrentUserService = { hasPurchaseOnCredit: () => hasPurchaseOnCredit };
        mockFeature = { isAvailable: () => true };
      });

      it('returns false when User does not have purchaseOnCredit', () => {
        hasPurchaseOnCredit = false;

        expect(new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(false);
      });

      it('returns true when User has purchaseOnCredit', () => {
        hasPurchaseOnCredit = true;

        expect(new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(true);
      });
    });

    describe('editAddress', () => {
      it('should return true for an address of type "User" that has a valid address', () => {
        let addr: any = { type: 'User', address: {} };
        expect(capabilitiesUnderTest.editAddress(addr)).toBe(true);
      });

      it('should return false for an address of type "Account" that has a valid address', () => {
        let addr: any = { type: 'Account', address: {} };
        expect(capabilitiesUnderTest.editAddress(addr)).toBe(false);
      });

      it('should return false for an address of type "User" that does not have a valid address', () => {
        let addr: any = { type: 'Account' };
        expect(capabilitiesUnderTest.editAddress(addr)).toBe(false);
      });
    });

    describe('addAddress', () => {
      it('should return false for an address of type "User" that has a valid address', () => {
        let addr: any = { type: 'User', address: {} };
        expect(capabilitiesUnderTest.addAddress(addr)).toBe(false);
      });

      it('should return false for an address of type "Account" that does not have a valid address', () => {
        let addr: any = { type: 'Account' };
        expect(capabilitiesUnderTest.addAddress(addr)).toBe(false);
      });

      it('should return true for an address of type "User" that does not have a valid address', () => {
        let addr: any = { type: 'User' };
        expect(capabilitiesUnderTest.addAddress(addr)).toBe(true);
      });
    });

    describe('editAccountAddress', () => {
      let hasPermission: boolean, addr: any;

      beforeEach(() => {
        mockCurrentUserService = { hasPermission: () => hasPermission };
      });

      it('should return false if the User doesnt have the permission', () => {
        addr = { type: 'Account', address: {} };
        hasPermission = false;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.editAccountAddress(addr)).toBe(false);
      });

      it('should return false if the address is of type "User"', () => {
        addr = { type: 'User', address: {} };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.editAccountAddress(addr)).toBe(false);
      });

      it('should return false if there is no address', () => {
        addr = { type: 'Account' };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.editAccountAddress(addr)).toBe(false);
      });

      it('should return true if all conditions are met', () => {
        addr = { type: 'Account', address: {} };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.editAccountAddress(addr)).toBe(true);
      });
    });

    describe('addAccountAddress', () => {
      let hasPermission: boolean, addr: any;

      beforeEach(() => {
        mockCurrentUserService = { hasPermission: () => hasPermission };
      });

      it('should return false if the User doesnt have the permission', () => {
        addr = { type: 'Account' };
        hasPermission = false;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.addAccountAddress(addr)).toBe(false);
      });

      it('should return false if the address is of type "User"', () => {
        addr = { type: 'User' };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.addAccountAddress(addr)).toBe(false);
      });

      it('should return false if there is an address', () => {
        addr = { type: 'Account', address: {} };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.addAccountAddress(addr)).toBe(false);
      });

      it('should return true if all conditions are met', () => {
        addr = { type: 'Account' };
        hasPermission = true;
        capabilitiesUnderTest = new CommerceCapabilities(mockCurrentUserService, null, null);
        expect(capabilitiesUnderTest.addAccountAddress(addr)).toBe(true);
      });
    });

    describe('userHas()', () => {
      let hasPermission: boolean;

      beforeEach(() => {
        mockCurrentUserService = { hasPermission: () => hasPermission };
      });

      it('returns false when User does not have permission', () => {
        hasPermission = false;

        expect(new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).userHas('whatever'))
          .toBe(false);
      });

      it('returns true when User has permission', () => {
        hasPermission = true;

        expect(new CommerceCapabilities(mockCurrentUserService, mockUiState, mockFeature).userHas('whatever'))
          .toBe(true);
      });
    });
  });
};
