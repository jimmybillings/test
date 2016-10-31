import { CollectionShowResolver } from './collection-show.resolver';

export function main() {
  describe('Collection Show Resolver', () => {
    let resolverUnderTest: CollectionShowResolver;

    beforeEach(() => {
      resolverUnderTest = new CollectionShowResolver(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

