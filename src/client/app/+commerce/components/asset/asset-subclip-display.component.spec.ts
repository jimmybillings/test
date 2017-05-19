import { AssetSubclipDisplayComponent } from './asset-subclip-display.component';

export function main() {
  describe('Asset Subclip Display Component', () => {
    let componentUnderTest: AssetSubclipDisplayComponent;
    let mockAsset: any;
    let mockEnhancedAsset: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockAsset = {};
      mockEnhancedAsset = {};
      mockAssetService = {
        enhance: () => mockEnhancedAsset
      };
      componentUnderTest = new AssetSubclipDisplayComponent(mockAssetService);
      componentUnderTest.asset = mockAsset;
    });

    describe('isSubclipped getter', () => {
      it('returns true if the asset is subclipped', () => {
        mockEnhancedAsset.isSubclipped = true;

        expect(componentUnderTest.isSubclipped).toBe(true);
      });

      it('returns false if the asset is not subclipped', () => {
        mockEnhancedAsset.isSubclipped = false;

        expect(componentUnderTest.isSubclipped).toBe(false);
      });
    });

    describe('subclipSegmentStyles getter', () => {
      it('returns styles based on the asset', () => {
        mockEnhancedAsset.inMarkerPercentage = 17;
        mockEnhancedAsset.subclipDurationPercentage = 42;

        expect(componentUnderTest.subclipSegmentStyles).toEqual({ 'margin-left.%': 17, 'width.%': 42, 'min-width.px': 2 });
      });
    });

    describe('inMarkerFrame getter', () => {
      it('returns the in marker frame from the asset', () => {
        mockEnhancedAsset.inMarkerFrame = { some: 'frame' };

        expect(componentUnderTest.inMarkerFrame).toEqual({ some: 'frame' });
      });
    });

    describe('outMarkerFrame getter', () => {
      it('returns the out marker frame from the asset', () => {
        mockEnhancedAsset.outMarkerFrame = { some: 'frame' };

        expect(componentUnderTest.outMarkerFrame).toEqual({ some: 'frame' });
      });
    });

    describe('subclipDurationFrame getter', () => {
      it('returns the subclip duration frame from the asset', () => {
        mockEnhancedAsset.subclipDurationFrame = { some: 'frame' };

        expect(componentUnderTest.subclipDurationFrame).toEqual({ some: 'frame' });
      });
    });
  });
}
