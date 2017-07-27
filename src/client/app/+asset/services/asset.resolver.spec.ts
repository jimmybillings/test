import { AssetResolver } from './asset.resolver';

export function main() {
  describe('Asset Resolver', () => {
    let resolverUnderTest: AssetResolver;

    beforeEach(() => {
      resolverUnderTest = new AssetResolver(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

