import { WzFormDialogComponent } from './wz.form-dialog.component';

export function main() {
  xdescribe('Wz Form Dialog Component', () => {
    let componentUnderTest: WzFormDialogComponent;

    beforeEach(() => {
      componentUnderTest = new WzFormDialogComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
