import { CartBillingTabComponent } from './cart-billing-tab.component';

export function main() {
  xdescribe('Cart Billing Tab Component', () => {
    let componentUnderTest: CartBillingTabComponent;

    beforeEach(() => {
      componentUnderTest = new CartBillingTabComponent(null, null, null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
