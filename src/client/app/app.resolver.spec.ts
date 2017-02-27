import { AppResolver } from './app.resolver';

export function main() {
  describe('App Resolver', () => {
    let resolverUnderTest: AppResolver;

    beforeEach(() => {
      resolverUnderTest = new AppResolver(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
