import { WzSubclipEditorComponent } from './wz.subclip-editor.component';

export function main() {
  fdescribe('Wz Subclip Editor Component', () => {
    let componentUnderTest: WzSubclipEditorComponent;

    beforeEach(() => {
      componentUnderTest = new WzSubclipEditorComponent();
      componentUnderTest.save.emit = jasmine.createSpy('save emitter');
    });

    describe('markersAreRemovable getter', () => {
      beforeEach(() => componentUnderTest.asset = {});

      describe('when asset.timeStart is undefined', () => {
        it('returns false if player\'s markers are both set', () => {
          componentUnderTest.onPlayerMarkerChange({ in: 42, out: 4242 });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: 4242 });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: 42, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s markers are both unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });
      });

      describe('when asset.timeStart is defined', () => {
        beforeEach(() => componentUnderTest.asset.timeStart = 7);

        it('returns false if player\'s markers are both set', () => {
          componentUnderTest.onPlayerMarkerChange({ in: 42, out: 4242 });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns true if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: 4242 });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });

        it('returns true if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: 42, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });

        it('returns true if player\'s markers are both unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });
      });
    });

    describe('markersAreSavable getter', () => {
      it('returns true if player\'s markers are both set', () => {
        componentUnderTest.onPlayerMarkerChange({ in: 42, out: 4242 });

        expect(componentUnderTest.markersAreSavable).toBe(true);
      });

      it('returns false if player\'s in marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: undefined, out: 4242 });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s out marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: 42, out: undefined });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s markers are both unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });
    });

    describe('onCancelButtonClick()', () => {
      it('calls dialog.close()', () => {
        componentUnderTest.dialog = { close: jasmine.createSpy('close') };
        componentUnderTest.onCancelButtonClick();

        expect(componentUnderTest.dialog.close).toHaveBeenCalledWith();
      });
    });

    describe('onSaveButtonClick()', () => {
      it('emits the updated markers', () => {
        componentUnderTest.onPlayerMarkerChange({ in: 42, out: 4242 });

        componentUnderTest.onSaveButtonClick();

        expect(componentUnderTest.save.emit).toHaveBeenCalledWith({ in: 42, out: 4242 });
      });
    });

    describe('onRemoveButtonClick()', () => {
      it('emits the updated markers', () => {
        componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

        componentUnderTest.onRemoveButtonClick();

        expect(componentUnderTest.save.emit).toHaveBeenCalledWith({ in: undefined, out: undefined });
      });
    });
  });
}
