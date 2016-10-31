import { LoggedOutGuard } from './logged-out.guard';

export function main() {
  describe('Logged Out Guard', () => {
    let serviceUnderTest: LoggedOutGuard;
    let mockCurrentUser: any, mockErrorActions: any;
    beforeEach(() => {
      mockErrorActions = { handle: jasmine.createSpy('handle') };
    });

    describe('canActivate()', () => {
      it('Should return true if the user is logged in', () => {
        mockCurrentUser = { loggedIn: jasmine.createSpy('loggedIn').and.returnValue(true) };
        serviceUnderTest = new LoggedOutGuard(mockCurrentUser, mockErrorActions);
        let action = serviceUnderTest.canActivate();
        expect(action).toEqual(true);
      });

      it('Should return false and pass a 401 to the error.handle method', () => {
        mockCurrentUser = { loggedIn: jasmine.createSpy('loggedIn').and.returnValue(false) };
        serviceUnderTest = new LoggedOutGuard(mockCurrentUser, mockErrorActions);
        let action = serviceUnderTest.canActivate();
        expect(mockErrorActions.handle).toHaveBeenCalledWith({ status: 401 });
        expect(action).toEqual(false);
      });
    });

  });
}
