import { AssetComponent } from './asset.component';

export function main() {
  xdescribe('Asset Component', () => {
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      componentUnderTest = new AssetComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
