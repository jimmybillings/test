import { WzNotificationDialogComponent } from './wz.notification-dialog.component';

export function main() {
  xdescribe('Wz Notification Dialog Component', () => {
    let componentUnderTest: WzNotificationDialogComponent;

    beforeEach(() => {
      componentUnderTest = new WzNotificationDialogComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
