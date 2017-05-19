import { CollectionTrayComponent } from './collection-tray.component';
import { Asset } from '../../shared/interfaces/common.interface';

export function main() {
  describe('Collection Tray Component', () => {
    let componentUnderTest: CollectionTrayComponent;
    let mockAsset: any;
    let mockEnhancedAsset: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockAsset = { assetId: 1234, name: 'mockAsset' };
      mockEnhancedAsset = {};
      mockAssetService = { enhance: (asset: any): any => mockEnhancedAsset };

      componentUnderTest = new CollectionTrayComponent(null, mockAssetService);
      componentUnderTest.collection = { assets: { items: [mockAsset] } };
    });

    describe('hasId()', () => {
      it('returns true when the asset exists and has an id', () => {
        expect(componentUnderTest.hasId({ assetId: 47 } as Asset)).toBe(true);
      });

      it('returns false when the asset is undefined', () => {
        expect(componentUnderTest.hasId(undefined)).toBe(false);
      });

      it('returns false when the asset is null', () => {
        expect(componentUnderTest.hasId(null)).toBe(false);
      });

      it('returns false when the asset doesn\'t have an id', () => {
        expect(componentUnderTest.hasId({} as Asset)).toBe(false);
      });
    });

    describe('routerLinkFor()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        mockEnhancedAsset.routerLink = ['/some', 'id', { some: 'parameters' }];

        expect(componentUnderTest.routerLinkFor(mockAsset)).toEqual(['/some', 'id', { some: 'parameters' }]);
      });
    });

    describe('hasThumbnail()', () => {
      it('returns true if the asset has a thumbnail URL', () => {
        mockEnhancedAsset.thumbnailUrl = 'some URL';

        expect(componentUnderTest.hasThumbnail(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a thumbnail URL', () => {
        expect(componentUnderTest.hasThumbnail(mockAsset)).toBe(false);
      });
    });

    describe('thumbnailUrlFor()', () => {
      it('returns the thumbnail URL for the asset', () => {
        mockEnhancedAsset.thumbnailUrl = 'some URL';

        expect(componentUnderTest.thumbnailUrlFor(mockAsset)).toEqual('some URL');
      });
    });
  });
}
