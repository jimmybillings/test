import { CheckoutStore } from './checkout.store';

export function main() {
  xdescribe('Checkout Store', () => {
    let storeUnderTest: CheckoutStore;

    beforeEach(() => {
      storeUnderTest = new CheckoutStore(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
