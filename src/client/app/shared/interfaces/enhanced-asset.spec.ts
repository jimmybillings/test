import { EnhancedAsset } from './enhanced-asset';

export function main() {
  describe('Enhanced Asset', () => {
    let assetUnderTest: EnhancedAsset;

    beforeEach(() => {
      assetUnderTest = new EnhancedAsset();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
