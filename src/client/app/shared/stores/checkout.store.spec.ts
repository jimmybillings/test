import { CheckoutStore } from './checkout.store';

export function main() {
  describe('Checkout Store', () => {
    let storeUnderTest: CheckoutStore;

    beforeEach(() => {
      storeUnderTest = new CheckoutStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
