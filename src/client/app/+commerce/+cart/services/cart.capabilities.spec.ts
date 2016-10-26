import { Observable } from 'rxjs/Rx';

import { CartCapabilities } from './cart.capabilities';

export function main() {
  describe('Cart Capabilities', () => {
    let mockCurrentUser: any;
    let mockUiState: any;
    let capabilitiesUnderTest: CartCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new CartCapabilities(mockCurrentUser, mockUiState);
      mockCurrentUser = {};
      mockUiState = {};
    });

    describe('viewCartIcon()', () => {
      let loggedIn: boolean;
      let headerIsExpanded: boolean;

      beforeEach(() => {
        mockCurrentUser = { loggedIn: () => loggedIn };
        mockUiState = { headerIsExpanded: () => Observable.of(headerIsExpanded) };
      });

      it('returns observable of true when not logged in and header not expanded', () => {
        loggedIn = false;
        headerIsExpanded = false;
        new CartCapabilities(mockCurrentUser, mockUiState).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when not logged in and header is expanded', () => {
        loggedIn = false;
        headerIsExpanded = true;
        new CartCapabilities(mockCurrentUser, mockUiState).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when logged in and header not expanded', () => {
        loggedIn = true;
        headerIsExpanded = false;
        new CartCapabilities(mockCurrentUser, mockUiState).viewCartIcon()
          .subscribe(answer => expect(answer).toBe(false));
      });

      it('returns observable of true when logged in and header is expanded', () => {
        loggedIn = true;
        headerIsExpanded = true;
        new CartCapabilities(mockCurrentUser, mockUiState).viewCartIcon()
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

        expect(new CartCapabilities(mockCurrentUser, mockUiState).purchaseOnCredit())
          .toBe(false);
      });

      it('returns true when user has purchaseOnCredit', () => {
        hasPurchaseOnCredit = true;

        expect(new CartCapabilities(mockCurrentUser, mockUiState).purchaseOnCredit())
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

        expect(new CartCapabilities(mockCurrentUser, mockUiState).userHas('whatever'))
          .toBe(false);
      });

      it('returns true when user has permission', () => {
        hasPermission = true;

        expect(new CartCapabilities(mockCurrentUser, mockUiState).userHas('whatever'))
          .toBe(true);
      });
    });
  });
};
