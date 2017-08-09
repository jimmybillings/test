import { WzAssetListComponent } from './wz.asset-list.component';

export function main() {
  xdescribe('Wz Asset List Component', () => {
    let componentUnderTest: WzAssetListComponent;

    beforeEach(() => {
      componentUnderTest = new WzAssetListComponent(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
