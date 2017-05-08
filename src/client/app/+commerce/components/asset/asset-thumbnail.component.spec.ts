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
      it('has the correct base path', () => {
        expect(componentUnderTest.routerLink[0]).toEqual('/asset');
      });

      it('adds the assetId', () => {
        expect(componentUnderTest.routerLink[1]).toEqual(47);
      });

      it('adds an empty parameters object by default', () => {
        expect(componentUnderTest.routerLink[2]).toEqual({});
      });

      it('adds a full parameters object when everything is proper', () => {
        mockEnhancedAsset.uuid = 'some UUID';
        mockEnhancedAsset.timeStart = 1;
        mockEnhancedAsset.timeEnd = 2;

        expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID', timeStart: 1, timeEnd: 2 });
      });

      describe('UUID', () => {
        it('gets added when it is defined', () => {
          mockEnhancedAsset.uuid = 'some UUID';

          expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID' });
        });

        it('does not get added when it is undefined', () => {
          mockEnhancedAsset.uuid = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeStart', () => {
        it('gets added when it is positive', () => {
          mockEnhancedAsset.timeStart = 1;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeStart: 1 });
        });

        it('gets added when it is zero', () => {
          mockEnhancedAsset.timeStart = 0;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeStart: 0 });
        });

        it('does not get added when it is negative', () => {
          mockEnhancedAsset.timeStart = -1;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          mockEnhancedAsset.timeStart = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeEnd', () => {
        it('gets added when it is positive', () => {
          mockEnhancedAsset.timeEnd = 1;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeEnd: 1 });
        });

        it('gets added when it is zero', () => {
          mockEnhancedAsset.timeEnd = 0;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeEnd: 0 });
        });

        it('does not get added when it is negative', () => {
          mockEnhancedAsset.timeEnd = -1;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          mockEnhancedAsset.timeEnd = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
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
