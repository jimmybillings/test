import { AssetDataComponent } from './asset-data.component';

export function main() {
  xdescribe('Asset Data Component', () => {
    let componentUnderTest: AssetDataComponent;

    beforeEach(() => {
      componentUnderTest = new AssetDataComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
