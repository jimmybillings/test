import { AssetStore } from './asset.store';

export function main() {
  describe('Asset Store', () => {
    let storeUnderTest: AssetStore;

    beforeEach(() => {
      storeUnderTest = new AssetStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

