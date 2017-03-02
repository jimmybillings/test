import { HomeResolver } from './home.resolver';

export function main() {
  describe('Home Resolver', () => {
    let resolverUnderTest: HomeResolver;

    beforeEach(() => {
      resolverUnderTest = new HomeResolver(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
