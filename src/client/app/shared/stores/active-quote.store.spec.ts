import { ActiveQuoteStore } from './active-quote.store';

export function main() {
  describe('Active Quote Store', () => {
    let storeUnderTest: ActiveQuoteStore;

    beforeEach(() => {
      storeUnderTest = new ActiveQuoteStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
