import { AdminAuthGuard } from './admin.auth.guard';

export function main() {
  describe('Admin Auth Guard', () => {
    let mockCurrentUserService: any;
    let mockError: any;
    let mockCapabilites: any;

    describe('canActivate()', () => {
      let loggedIn: boolean;
      let hasRoot: boolean;

      beforeEach(() => {
        mockCurrentUserService = { loggedIn: () => loggedIn };
        mockCapabilites = { viewAdmin: () => hasRoot };
        mockError = { dispatch: jasmine.createSpy('dispatch') };
      });

      it('returns true when logged in and has root', () => {
        loggedIn = true;
        hasRoot = true;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUserService).canActivate()).toBe(true);
        expect(mockError.dispatch).not.toHaveBeenCalled();
      });

      it('returns false/unauthenticated when not logged in', () => {
        loggedIn = false;
        hasRoot = false;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUserService).canActivate()).toBe(false);
        expect(mockError.dispatch).toHaveBeenCalledWith({ status: 401 });
      });

      it('returns false/unauthorized when logged in and not root', () => {
        loggedIn = true;
        hasRoot = false;

        expect(new AdminAuthGuard(mockCapabilites, mockError, mockCurrentUserService).canActivate()).toBe(false);
        expect(mockError.dispatch).toHaveBeenCalledWith({ status: 403 });
      });
    });
  });
};
