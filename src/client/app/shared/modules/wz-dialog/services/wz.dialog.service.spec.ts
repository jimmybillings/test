import { WzDialogService } from './wz.dialog.service';

export function main() {
  describe('Wz Dialog Service', () => {
    let serviceUnderTest: WzDialogService, mockDialog: any;

    beforeEach(() => {
      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({ componentInstance: {}, afterClosed: () => { } })
      };
      serviceUnderTest = new WzDialogService(mockDialog);
    });

    describe('openNotification()', () => {
      it('should open a dialog', () => {
        serviceUnderTest.openNotification({}, {});
        expect(mockDialog.open).toHaveBeenCalled();
      });
    });
  });
}
