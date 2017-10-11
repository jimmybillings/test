import { WzSubclipEditorComponent } from './wz.subclip-editor.component';
import { Frame } from '../../modules/wazee-frame-formatter/index';
import { EnhancedAsset } from '../../interfaces/enhanced-asset';

export function main() {
  describe('Wz Subclip Editor Component', () => {
    let componentUnderTest: WzSubclipEditorComponent;
    let inMarkerFrame: Frame;
    let outMarkerFrame: Frame;

    beforeEach(() => {
      componentUnderTest = new WzSubclipEditorComponent();
      componentUnderTest.cancel.emit = jasmine.createSpy('cancel emitter');
      componentUnderTest.save.emit = jasmine.createSpy('save emitter');

      inMarkerFrame = new Frame(29.97).setFromFrameNumber(42);
      outMarkerFrame = new Frame(29.97).setFromFrameNumber(4242);
    });

    describe('markersAreRemovable getter', () => {
      describe('when asset is not subclipped', () => {
        beforeEach(() => componentUnderTest.enhancedAsset = { isSubclipped: false } as EnhancedAsset);

        it('returns false if player\'s markers are both set', () => {
          componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s markers are both unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });
      });

      describe('when asset is subclipped', () => {
        beforeEach(() => componentUnderTest.enhancedAsset = { isSubclipped: true } as EnhancedAsset);

        it('returns false if player\'s markers are both set', () => {
          componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns true if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: undefined, out: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });

        it('returns true if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: undefined });

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
        componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: outMarkerFrame });

        expect(componentUnderTest.markersAreSavable).toBe(true);
      });

      it('returns false if player\'s in marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: undefined, out: outMarkerFrame });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s out marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: undefined });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s markers are both unset', () => {
        componentUnderTest.onPlayerMarkerChange({ in: undefined, out: undefined });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });
    });

    describe('onCancelButtonClick()', () => {
      it('emits a cancel event', () => {
        componentUnderTest.onCancelButtonClick();

        expect(componentUnderTest.cancel.emit).toHaveBeenCalledWith();
      });
    });

    describe('onSaveButtonClick()', () => {
      it('emits the updated markers', () => {
        componentUnderTest.onPlayerMarkerChange({ in: inMarkerFrame, out: outMarkerFrame });

        componentUnderTest.onSaveButtonClick();

        expect(componentUnderTest.save.emit).toHaveBeenCalledWith({ in: inMarkerFrame, out: outMarkerFrame });
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
