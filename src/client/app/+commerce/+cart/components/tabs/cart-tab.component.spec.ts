import { CartTabComponent } from './cart-tab.component';

export function main() {
  describe('Cart Tab Component', () => {
    let componentUnderTest: CartTabComponent;

    beforeEach(() => {
      componentUnderTest = new CartTabComponent(null, null, null, null, null, null, null, null, null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
