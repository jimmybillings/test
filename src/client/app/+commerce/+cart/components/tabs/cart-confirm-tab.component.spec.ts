import { CartConfirmTabComponent } from './cart-confirm-tab.component';

export function main() {
  xdescribe('Cart Confirm Tab Component', () => {
    let componentUnderTest: CartConfirmTabComponent;

    beforeEach(() => {
      componentUnderTest = new CartConfirmTabComponent(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
