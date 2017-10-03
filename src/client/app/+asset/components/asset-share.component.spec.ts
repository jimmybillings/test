import { AssetShareComponent } from './asset-share.component';

export function main() {
  describe('Asset Share Component', () => {
    let componentUnderTest: AssetShareComponent;

    beforeEach(() => {
      componentUnderTest = new AssetShareComponent(null, null);
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

