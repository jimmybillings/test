import { ActiveQuoteStore } from './active-quote.store';

export function main() {
  xdescribe('Active Quote Store', () => {
    let storeUnderTest: ActiveQuoteStore;

    beforeEach(() => {
      storeUnderTest = new ActiveQuoteStore(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
