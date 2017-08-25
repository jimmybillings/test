import { CollectionTrayComponent } from './collection-tray.component';
import { Asset } from '../../shared/interfaces/common.interface';
import * as EnhancedMock from '../../shared/interfaces/enhanced-asset';
import { mockAsset } from '../../shared/mocks/mock-asset';

export function main() {
  describe('Collection Tray Component', () => {
    let componentUnderTest: CollectionTrayComponent;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;

    beforeEach(() => {
      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockAsset, null);
      componentUnderTest = new CollectionTrayComponent(null);
      componentUnderTest.collection = { assets: { items: [EnhancedMock.enhanceAsset(mockAsset, null)] } };
    });

    describe('hasId()', () => {
      it('returns true when the asset exists and has an id', () => {
        expect(componentUnderTest.hasId({ assetId: 47 } as EnhancedMock.EnhancedAsset)).toBe(true);
      });

      it('returns false when the asset is undefined', () => {
        expect(componentUnderTest.hasId(undefined)).toBe(false);
      });

      it('returns false when the asset is null', () => {
        expect(componentUnderTest.hasId(null)).toBe(false);
      });

      it('returns false when the asset doesn\'t have an id', () => {
        expect(componentUnderTest.hasId({} as EnhancedMock.EnhancedAsset)).toBe(false);
      });
    });

    describe('routerLinkFor()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        expect(componentUnderTest.routerLinkFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.routerLink);
      });
    });

    describe('hasThumbnail()', () => {
      it('returns true if the asset has a thumbnail URL', () => {
        expect(componentUnderTest.hasThumbnail(mockEnhancedAsset)).toBe(true);
      });

    });

    describe('thumbnailUrlFor()', () => {
      it('returns the thumbnail URL for the asset', () => {
        expect(componentUnderTest.thumbnailUrlFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.thumbnailUrl);
      });
    });
  });
}
