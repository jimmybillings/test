import { SearchStore } from './search.store';

export function main() {
  xdescribe('Asset Store', () => {
    let storeUnderTest: SearchStore;

    beforeEach(() => {
      storeUnderTest = new SearchStore(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

