import { AssetGuard } from './asset.guard';

export function main() {
  describe('Asset Guard', () => {
    let guardUnderTest: AssetGuard;

    beforeEach(() => {
      guardUnderTest = new AssetGuard(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

