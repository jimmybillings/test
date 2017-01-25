import { Observable } from 'rxjs/Rx';

import { CartCapabilities } from './cart.capabilities';

export function main() {
  describe('Cart Capabilities', () => {
    let mockCurrentUser: any;
    let mockUiState: any;
    let mockFeature: any;
    let capabilitiesUnderTest: CartCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new CartCapabilities(mockCurrentUser, mockUiState, mockFeature);
      mockCurrentUser = {};
      mockUiState = {};
      mockFeature = {};
    });

    describe('viewCartIcon()', () => {
      let loggedIn: boolean;
      let permission: boolean;
      let headerIsExpanded: boolean;

      beforeEach(() => {
        mockCurrentUser = { loggedIn: () => loggedIn, hasPermission: () => permission };
        mockUiState = { headerIsExpanded: () => Observable.of(headerIsExpanded) };
        mockFeature = { access: () => true };
      });

      it('returns observable of false when header not expanded and no permission', () => {
        headerIsExpanded = false;
        permission = false;
        new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header is expanded but no permission', () => {
        headerIsExpanded = true;
        permission = false;
        new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of false when header not expanded but has permission', () => {
        headerIsExpanded = false;
        permission = true;
        new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when header is expanded and has permission', () => {
        headerIsExpanded = true;
        permission = true;
        new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('purchaseOnCredit()', () => {
      let hasPurchaseOnCredit: boolean;

      beforeEach(() => {
        mockCurrentUser = { hasPurchaseOnCredit: () => hasPurchaseOnCredit };
      });

      it('returns false when user does not have purchaseOnCredit', () => {
        hasPurchaseOnCredit = false;

        expect(new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(false);
      });

      it('returns true when user has purchaseOnCredit', () => {
        hasPurchaseOnCredit = true;

        expect(new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).purchaseOnCredit())
          .toBe(true);
      });
    });

    describe('userHas()', () => {
      let hasPermission: boolean;

      beforeEach(() => {
        mockCurrentUser = { hasPermission: () => hasPermission };
      });

      it('returns false when user does not have permission', () => {
        hasPermission = false;

        expect(new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).userHas('whatever'))
          .toBe(false);
      });

      it('returns true when user has permission', () => {
        hasPermission = true;

        expect(new CartCapabilities(mockCurrentUser, mockUiState, mockFeature).userHas('whatever'))
          .toBe(true);
      });
    });
  });
};
