import { AdminAuthGuard } from './admin.auth.guard';

export function main() {
  describe('Admin Auth Guard', () => {
    let mockCurrentUser: any;
    let mockError: any;
    let mockCapabilites: any;

    describe('canActivate()', () => {
      let loggedIn: boolean;
      let hasRoot: boolean;

      beforeEach(() => {
        mockCurrentUser = { loggedIn: () => loggedIn };
        mockCapabilites = { viewAdmin: () => hasRoot };
        mockError = { handle: jasmine.createSpy('handle') };
      });

      it('returns true when logged in and has root', () => {
        loggedIn = true;
        hasRoot = true;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUser).canActivate()).toBe(true);
        expect(mockError.handle).not.toHaveBeenCalled();
      });

      it('returns false/unauthenticated when not logged in', () => {
        loggedIn = false;
        hasRoot = false;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUser).canActivate()).toBe(false);
        expect(mockError.handle).toHaveBeenCalledWith({ status: 401 });
      });

      it('returns false/unauthorized when logged in and not root', () => {
        loggedIn = true;
        hasRoot = false;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUser).canActivate()).toBe(false);
        expect(mockError.handle).toHaveBeenCalledWith({ status: 403 });
      });
    });
  });
};
