import { AssetGuard } from './asset.guard';

export function main() {
  xdescribe('Asset Guard', () => {
    let guardUnderTest: AssetGuard;

    beforeEach(() => {
      guardUnderTest = new AssetGuard(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

