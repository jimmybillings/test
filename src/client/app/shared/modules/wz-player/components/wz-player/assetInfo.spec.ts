import { AssetInfo } from './assetInfo';

export function main() {
  describe('Asset Info', () => {
    let assetInfoUnderTest: AssetInfo;

    beforeEach(() => {
      assetInfoUnderTest = new AssetInfo();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
