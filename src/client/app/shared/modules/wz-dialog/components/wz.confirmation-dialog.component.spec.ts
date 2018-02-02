import { WzConfirmationDialogComponent } from './wz.confirmation-dialog.component';

export function main() {
  describe('Wz Confirmation Dialog Component', () => {
    let componentUnderTest: WzConfirmationDialogComponent;

    beforeEach(() => {
      componentUnderTest = new WzConfirmationDialogComponent();
    });

    describe('onClickAccept', () => {
      it('should emit the accept event', () => {
        spyOn(componentUnderTest.accept, 'emit');
        componentUnderTest.onClickAccept();
        expect(componentUnderTest.accept.emit).toHaveBeenCalled();
      });
    });

    describe('onClickDecline', () => {
      it('should emit the decline event', () => {
        spyOn(componentUnderTest.decline, 'emit');
        componentUnderTest.onClickDecline();
        expect(componentUnderTest.decline.emit).toHaveBeenCalled();
      });
    });

    describe('stringHasValues()', () => {
      it('returns false when the input is just a string', () => {
        expect(componentUnderTest.stringHasValues('ross')).toBe(false);
      });

      it('returns true when the input is a TranslationString object', () => {
        expect(componentUnderTest.stringHasValues({ key: 'SOME_KEY', values: { some: 'values' } })).toBe(true);
      });
    });
  });
}
