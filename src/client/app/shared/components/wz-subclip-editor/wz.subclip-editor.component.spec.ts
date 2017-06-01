import { WzSubclipEditorComponent } from './wz.subclip-editor.component';
import { Frame } from 'wazee-frame-formatter';
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
          componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns false if player\'s markers are both unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });
      });

      describe('when asset is subclipped', () => {
        beforeEach(() => componentUnderTest.enhancedAsset = { isSubclipped: true } as EnhancedAsset);

        it('returns false if player\'s markers are both set', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(false);
        });

        it('returns true if player\'s in marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: outMarkerFrame });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });

        it('returns true if player\'s out marker is unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });

        it('returns true if player\'s markers are both unset', () => {
          componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: undefined });

          expect(componentUnderTest.markersAreRemovable).toBe(true);
        });
      });
    });

    describe('markersAreSavable getter', () => {
      it('returns true if player\'s markers are both set', () => {
        componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: outMarkerFrame });

        expect(componentUnderTest.markersAreSavable).toBe(true);
      });

      it('returns false if player\'s in marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: outMarkerFrame });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s out marker is unset', () => {
        componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: undefined });

        expect(componentUnderTest.markersAreSavable).toBe(false);
      });

      it('returns false if player\'s markers are both unset', () => {
        componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: undefined });

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
        componentUnderTest.onPlayerMarkerChange({ inFrame: inMarkerFrame, outFrame: outMarkerFrame });

        componentUnderTest.onSaveButtonClick();

        expect(componentUnderTest.save.emit).toHaveBeenCalledWith({ inMilliseconds: 42, outMilliseconds: 4242 });
      });
    });

    describe('onRemoveButtonClick()', () => {
      it('emits the updated markers', () => {
        componentUnderTest.onPlayerMarkerChange({ inFrame: undefined, outFrame: undefined });

        componentUnderTest.onRemoveButtonClick();

        expect(componentUnderTest.save.emit).toHaveBeenCalledWith({ inMilliseconds: undefined, outMilliseconds: undefined });
      });
    });
  });
}
