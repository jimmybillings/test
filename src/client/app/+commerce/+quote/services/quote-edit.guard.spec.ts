import { QuoteEditGuard } from './quote-edit.guard';

export function main() {
  describe('Quote Edit Guard', () => {
    let guardUnderTest: QuoteEditGuard;

    beforeEach(() => {
      guardUnderTest = new QuoteEditGuard(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
