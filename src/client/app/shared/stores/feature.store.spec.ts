import { FeatureStore } from './feature.store';

export function main() {
  describe('Some Class', () => {
    let storeUnderTest: FeatureStore;

    beforeEach(() => {
      storeUnderTest = new FeatureStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
