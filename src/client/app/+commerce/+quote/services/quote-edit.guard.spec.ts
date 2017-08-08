import { QuoteEditGuard } from './quote-edit.guard';

export function main() {
  xdescribe('Quote Edit Guard', () => {
    let guardUnderTest: QuoteEditGuard;

    beforeEach(() => {
      guardUnderTest = new QuoteEditGuard(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
