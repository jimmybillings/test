import { WzAssetGridComponent } from './wz.asset-grid.component';

export function main() {
  describe('Wz Asset Grid Component', () => {
    let componentUnderTest: WzAssetGridComponent;

    beforeEach(() => {
      componentUnderTest = new WzAssetGridComponent(null, null);
    });

    describe('assetCanBePurchased(asset)', () => {
      it('is false when asset is missing a Rights.Reproduction metadata field', () => {
        let asset = {
          metaData: [
            { name: 'someKey', value: 'someValue' }
          ]
        };
        expect(componentUnderTest.assetCanBePurchased(asset)).toBe(false);
      });

      it('is false when asset has an unaccepted value in the Rights.Reproduction metadata field', () => {
        let asset = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'someValue2' }
          ]
        };
        expect(componentUnderTest.assetCanBePurchased(asset)).toBe(false);
      });

      it('is true when Rights.Reproduction is Royalty Free', () => {
        let asset = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'Royalty Free' }
          ]
        };
        expect(componentUnderTest.assetCanBePurchased(asset)).toBe(true);
      });

      it('is true when Rights.Reproduction is Rights Managed', () => {
        let asset = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'Rights Managed' }
          ]
        };
        expect(componentUnderTest.assetCanBePurchased(asset)).toBe(true);
      });
    });
  });
}
