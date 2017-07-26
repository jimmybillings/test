import { WzAssetListComponent } from './wz.asset-list.component';

export function main() {
  describe('Wz Asset List Component', () => {
    let componentUnderTest: WzAssetListComponent;

    beforeEach(() => {
      componentUnderTest = new WzAssetListComponent(null, null);
    });

    it('has no functionality to test', () => {
      expect(true).toBe(true);
    });
  });
}
