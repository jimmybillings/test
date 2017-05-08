import { AssetSubclipDisplayComponent } from './asset-subclip-display.component';

export function main() {
  describe('Asset Subclip Display Component', () => {
    let componentUnderTest: AssetSubclipDisplayComponent;
    let mockAssetService: any;

    beforeEach(() => {
      componentUnderTest = new AssetSubclipDisplayComponent(mockAssetService);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
