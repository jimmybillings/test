import { WzAssetGridComponent } from './wz.asset-grid.component';

export function main() {
  xdescribe('Wz Asset Grid Component', () => {
    let componentUnderTest: WzAssetGridComponent;

    beforeEach(() => {
      componentUnderTest = new WzAssetGridComponent(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
