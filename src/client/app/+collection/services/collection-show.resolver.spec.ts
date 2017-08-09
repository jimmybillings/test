import { CollectionShowResolver } from './collection-show.resolver';

export function main() {
  xdescribe('Collection Show Resolver', () => {
    let resolverUnderTest: CollectionShowResolver;

    beforeEach(() => {
      resolverUnderTest = new CollectionShowResolver(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

