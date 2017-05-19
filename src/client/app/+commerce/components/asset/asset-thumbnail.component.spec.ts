import { AssetThumbnailComponent } from './asset-thumbnail.component';
import { Frame } from 'wazee-frame-formatter';
import { AssetService } from '../../../shared/services/asset.service';
import { Asset } from '../../../shared/interfaces/commerce.interface';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

export function main() {
  describe('Asset Thumbnail Component', () => {
    let componentUnderTest: AssetThumbnailComponent;
    let mockAsset: any;
    let mockEnhancedAsset: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockAsset = {};

      mockEnhancedAsset = {
        assetId: 47
      };

      mockAssetService = {
        enhance: (asset: Asset): any => {
          return mockEnhancedAsset;
        }
      };

      componentUnderTest = new AssetThumbnailComponent(mockAssetService);
      componentUnderTest.asset = mockAsset;
    });

    describe('routerLink()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        mockEnhancedAsset.routerLink = ['/some', 'id', { some: 'parameters' }];

        expect(componentUnderTest.routerLink).toEqual(['/some', 'id', { some: 'parameters' }]);
      });
    });

    describe('durationFrame()', () => {
      it('returns the enhanced asset\'s subclip duration frame', () => {
        mockEnhancedAsset.subclipDurationFrame = { some: 'frame' };

        expect(componentUnderTest.durationFrame).toEqual({ some: 'frame' });
      });
    });

    describe('isImage()', () => {
      it('returns true for an image', () => {
        mockEnhancedAsset.isImage = true;

        expect(componentUnderTest.isImage).toBe(true);
      });

      it('returns false for a non-image', () => {
        mockEnhancedAsset.isImage = false;

        expect(componentUnderTest.isImage).toBe(false);
      });
    });

    describe('thumbnailUrl()', () => {
      it('returns the enhanced asset\'s thumbnail URL', () => {
        mockEnhancedAsset.thumbnailUrl = '/some/url';

        expect(componentUnderTest.thumbnailUrl).toEqual('/some/url');
      });
    });
  });
}
