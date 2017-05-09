import { AssetComponent } from './asset.component';

export function main() {
  describe('Asset Component', () => {
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      componentUnderTest = new AssetComponent();
    });

    it('has no functionality to test', () => {
      expect(true).toBe(true);
    });
  });
};
