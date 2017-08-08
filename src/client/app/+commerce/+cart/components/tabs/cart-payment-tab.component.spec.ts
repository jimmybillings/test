import { CartPaymentTabComponent } from './cart-payment-tab.component';

export function main() {
  xdescribe('Cart Payment Tab Component', () => {
    let componentUnderTest: CartPaymentTabComponent;

    beforeEach(() => {
      componentUnderTest = new CartPaymentTabComponent(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
