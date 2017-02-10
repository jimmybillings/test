import { CartGuard } from './cart.guard';

export function main() {
  describe('Cart Guard', () => {
    let mockCartCapabilities: any;
    let mockError: any;

    describe('canActivate()', () => {
      let viewCarts: boolean;

      beforeEach(() => {
        mockCartCapabilities = { addToCart: () => viewCarts };
        mockError = { dispatch: jasmine.createSpy('dispatch') };
      });

      it('returns true when logged in', () => {
        viewCarts = true;

        expect(new CartGuard(mockCartCapabilities, mockError).canActivate(null, null))
          .toBe(true);
        expect(mockError.dispatch).not.toHaveBeenCalled();
      });

      it('returns false when not logged in', () => {
        viewCarts = false;

        expect(new CartGuard(mockCartCapabilities, mockError).canActivate(null, null))
          .toBe(false);
        expect(mockError.dispatch).toHaveBeenCalledWith({ status: 403 });
      });
    });
  });
};
