import { QuoteEditResolver } from './quote-edit.resolver';

export function main() {
  describe('Quote Edit Resolver', () => {
    let resolverUnderTest: QuoteEditResolver;

    beforeEach(() => {
      resolverUnderTest = new QuoteEditResolver(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
