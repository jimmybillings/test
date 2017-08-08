import { QuoteEditResolver } from './quote-edit.resolver';

export function main() {
  xdescribe('Quote Edit Resolver', () => {
    let resolverUnderTest: QuoteEditResolver;

    beforeEach(() => {
      resolverUnderTest = new QuoteEditResolver(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
