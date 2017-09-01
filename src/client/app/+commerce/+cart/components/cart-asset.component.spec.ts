import { CartAssetComponent } from './cart-asset.component';

export function main() {
  xdescribe('Cart Asset Component', () => {
    let componentUnderTest: CartAssetComponent;

    beforeEach(() => {
      componentUnderTest = new CartAssetComponent();
    });

    xit('has no testable functionality!', () => {
      expect(true).toBe(true);
    });
  });
}
