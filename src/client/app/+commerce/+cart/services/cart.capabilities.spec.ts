import { Observable } from 'rxjs/Rx';

import { CartCapabilities } from './cart.capabilities';

export function main() {
  describe('Cart Capabilities', () => {
    let mockCurrentUserService: any;
    let mockUiState: any;
    let mockFeature: any;
    let capabilitiesUnderTest: CartCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature);
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
        new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header is expanded but no permission', () => {
        loggedIn = false;
        headerIsExpanded = true;
        new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header not expanded but has permission', () => {
        loggedIn = false;
        headerIsExpanded = false;
        new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when header is expanded and has permission', () => {
        loggedIn = true;
        headerIsExpanded = true;
        new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('purchaseOnCredit()', () => {
      let hasPurchaseOnCredit: boolean;

      beforeEach(() => {
        mockCurrentUserService = { hasPurchaseOnCredit: () => hasPurchaseOnCredit };
        mockFeature = { isAvailable: () => true };
      });

      it('returns false when user does not have purchaseOnCredit', () => {
        hasPurchaseOnCredit = false;

        expect(new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(false);
      });

      it('returns true when user has purchaseOnCredit', () => {
        hasPurchaseOnCredit = true;

        expect(new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(true);
      });
    });

    describe('userHas()', () => {
      let hasPermission: boolean;

      beforeEach(() => {
        mockCurrentUserService = { hasPermission: () => hasPermission };
      });

      it('returns false when user does not have permission', () => {
        hasPermission = false;

        expect(new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).userHas('whatever'))
          .toBe(false);
      });

      it('returns true when user has permission', () => {
        hasPermission = true;

        expect(new CartCapabilities(mockCurrentUserService, mockUiState, mockFeature).userHas('whatever'))
          .toBe(true);
      });
    });
  });
};
