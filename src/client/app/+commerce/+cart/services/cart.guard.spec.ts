import { CartGuard } from './cart.guard';

export function main() {
  describe('Cart Guard', () => {
    let mockCurrentUser: any;
    let mockError: any;

    describe('canActivate()', () => {
      let loggedIn: boolean;

      beforeEach(() => {
        mockCurrentUser = { loggedIn: () => loggedIn };
        mockError = { handle: jasmine.createSpy('handle') };
      });

      it('returns true when logged in', () => {
        loggedIn = true;

        expect(new CartGuard(mockCurrentUser, mockError).canActivate(null, null))
          .toBe(true);
        expect(mockError.handle).not.toHaveBeenCalled();
      });

      it('returns false when not logged in', () => {
        loggedIn = false;

        expect(new CartGuard(mockCurrentUser, mockError).canActivate(null, null))
          .toBe(false);
        expect(mockError.handle).toHaveBeenCalledWith({ status: 401 });
      });
    });
  });
};
