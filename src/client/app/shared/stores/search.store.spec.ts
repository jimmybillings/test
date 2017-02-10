import { SearchStore } from './search.store';

export function main() {
  describe('Asset Store', () => {
    let storeUnderTest: SearchStore;

    beforeEach(() => {
      storeUnderTest = new SearchStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

