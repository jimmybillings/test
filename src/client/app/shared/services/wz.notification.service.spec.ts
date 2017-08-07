import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { WzNotificationService } from './wz.notification.service';

export function main() {
  describe('Wz Notification Service', () => {
    let serviceUnderTest: WzNotificationService;
    let mockErrorStore: any;
    let mockLocation: any;;
    let mockRouter: any, dialog: any;
    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockLocation = { path: () => 'test/path/2' };
      mockErrorStore = { data: new Subject() };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      dialog = { openNotificationDialog: jasmine.createSpy('openNotificationDialog').and.returnValue(Observable.of({})) };
      serviceUnderTest = new WzNotificationService(mockRouter, mockErrorStore, dialog, mockLocation);
    });

    describe('BadRequest()', () => {
      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        mockErrorStore.data.next({ status: 400 });
      });

      it('Should store a redirect url in localStorage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith('redirectUrl', 'test/path/2');
      });

      it('Should redirect to the login page', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/login']);
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'NOTIFICATION.REQUIRE_LOGIN',
          message: 'NOTIFICATION.REQUIRE_LOGIN_MESSAGE',
          prompt: 'NOTIFICATION.CLOSE'
        });
      });
    });

    describe('cantRegister()', () => {
      beforeEach(() => {
        mockErrorStore.data.next({ status: 451 });
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'REGISTER.DISALLOWED.TITLE',
          message: 'REGISTER.DISALLOWED.MESSAGE',
          prompt: 'REGISTER.DISALLOWED.PROMPT'
        });
      });
    });

    describe('unAuthorized()', () => {
      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        mockErrorStore.data.next({ status: 401 });
      });

      it('Should store a redirect url in localStorage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith('redirectUrl', 'test/path/2');
      });

      it('Should redirect to the login page', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/login']);
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'NOTIFICATION.ERROR',
          message: 'NOTIFICATION.INVALID_CREDENTIALS',
          prompt: 'NOTIFICATION.CLOSE'
        });
      });
    });

    describe('forbidden()', () => {
      beforeEach(() => {
        mockErrorStore.data.next({ status: 403 });
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'NOTIFICATION.ERROR',
          message: 'NOTIFICATION.NEED_PERMISSION',
          prompt: 'NOTIFICATION.CLOSE'
        });
      });
    });

    describe('expiredSession()', () => {
      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        mockErrorStore.data.next({ status: 419 });
      });

      it('Should store a redirect url in localStorage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith('redirectUrl', 'test/path/2');
      });

      it('Should redirect to the login page', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/login']);
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'NOTIFICATION.ERROR',
          message: 'NOTIFICATION.EXPIRED_SESSION',
          prompt: 'NOTIFICATION.CLOSE'
        });
      });
    });

    describe('customError()', () => {
      beforeEach(() => {
        mockErrorStore.data.next({ status: 'CUSTOM.ERROR' });
      });

      it('Should display a dialog to indicate what just happened', () => {
        expect(dialog.openNotificationDialog).toHaveBeenCalledWith({
          title: 'CUSTOM.ERROR',
          prompt: 'NOTIFICATION.CLOSE'
        });
      });
    });

    describe('notFound()', () => {
      beforeEach(() => {
        mockErrorStore.data.next({ status: 404 });
      });

      it('Should redirect to the 404 page', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
      });
    });

    describe('No Effect', () => {
      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        mockErrorStore.data.next({ status: 888 });
      });
      it('Should do nothing if the error code is a number but doesnt match anything thing in the switch case', () => {
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(dialog.openNotificationDialog).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('Should do nothing if the error has no status property', () => {
        mockErrorStore.data.next({});
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(dialog.openNotificationDialog).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });
  });
};

