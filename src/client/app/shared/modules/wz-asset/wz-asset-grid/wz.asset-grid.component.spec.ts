import { WzAssetGridComponent } from './wz.asset-grid.component';

export function main() {
  describe('Wz Asset Grid Component', () => {
    let componentUnderTest: WzAssetGridComponent;

    beforeEach(() => {
      componentUnderTest = new WzAssetGridComponent(null, null);
    });

    it('has no functionality to test', () => {
      expect(true).toBe(true);
    });
  });
}
