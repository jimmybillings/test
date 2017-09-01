import { AssetGuard } from './asset.guard';

export function main() {
  describe('Asset Guard', () => {
    let guardUnderTest: AssetGuard;

    beforeEach(() => {
      guardUnderTest = new AssetGuard(null, null, null, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
};

