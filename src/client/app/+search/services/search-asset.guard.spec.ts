import { SearchAssetGuard } from './search-asset.guard';

export function main() {
  xdescribe('Asset Guard', () => {
    let guardUnderTest: SearchAssetGuard;

    beforeEach(() => {
      guardUnderTest = new SearchAssetGuard(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

