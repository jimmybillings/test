import { SearchResolver } from './search.resolver';

export function main() {
  describe('Search Resolver', () => {
    let resolverUnderTest: SearchResolver;

    beforeEach(() => {
      resolverUnderTest = new SearchResolver(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

