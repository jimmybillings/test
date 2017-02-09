import { LoggedOutGuard } from './logged-out.guard';

export function main() {
  describe('Logged Out Guard', () => {
    let serviceUnderTest: LoggedOutGuard;
    let mockCurrentUserService: any, mockErrorActions: any;
    beforeEach(() => {
      mockErrorActions = { dispatch: jasmine.createSpy('dispatch') };
    });

    describe('canActivate()', () => {
      it('Should return true if the user is logged in', () => {
        mockCurrentUserService = { loggedIn: jasmine.createSpy('loggedIn').and.returnValue(true) };
        serviceUnderTest = new LoggedOutGuard(mockCurrentUserService, mockErrorActions);
        let action = serviceUnderTest.canActivate();
        expect(action).toEqual(true);
      });

      it('Should return false and pass a 401 to the error.handle method', () => {
        mockCurrentUserService = { loggedIn: jasmine.createSpy('loggedIn').and.returnValue(false) };
        serviceUnderTest = new LoggedOutGuard(mockCurrentUserService, mockErrorActions);
        let action = serviceUnderTest.canActivate();
        expect(mockErrorActions.dispatch).toHaveBeenCalledWith({ status: 401 });
        expect(action).toEqual(false);
      });
    });

  });
}
