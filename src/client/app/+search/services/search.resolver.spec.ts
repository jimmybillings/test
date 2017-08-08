import { SearchResolver } from './search.resolver';

export function main() {
  xdescribe('Search Resolver', () => {
    let resolverUnderTest: SearchResolver;

    beforeEach(() => {
      resolverUnderTest = new SearchResolver(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

