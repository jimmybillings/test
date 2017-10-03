import { AssetShareComponent } from './asset-share.component';
import { mockCommerceAssetLineItem } from '../../shared/mocks/mock-asset';
import * as EnhancedMock from '../../shared/interfaces/enhanced-asset';


export function main() {
  describe('Asset Share Component', () => {
    let componentUnderTest: AssetShareComponent;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;

    beforeEach(() => {
      componentUnderTest = new AssetShareComponent(null, null);
      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockCommerceAssetLineItem.asset, null);
      componentUnderTest.enhancedAsset = mockEnhancedAsset;
    });

    describe('ngOnDestroy', () => {
      it('calls the closeAssetShare method', () => {
        spyOn(componentUnderTest, 'closeAssetShare').and.callThrough();
        componentUnderTest.ngOnDestroy();
        expect(componentUnderTest.closeAssetShare).toHaveBeenCalled();
      });
    });
  });
};

