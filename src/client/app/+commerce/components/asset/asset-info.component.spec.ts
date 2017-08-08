import { AssetInfoComponent } from './asset-info.component';

export function main() {
  xdescribe('Asset Info Component', () => {
    let componentUnderTest: AssetInfoComponent;

    beforeEach(() => {
      componentUnderTest = new AssetInfoComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
