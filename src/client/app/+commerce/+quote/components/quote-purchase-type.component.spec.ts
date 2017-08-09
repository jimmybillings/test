import { QuotePurchaseTypeComponent } from './quote-purchase-type.component';

export function main() {
  xdescribe('Quote Purchase Type Component', () => {
    let componentUnderTest: QuotePurchaseTypeComponent;

    beforeEach(() => {
      componentUnderTest = new QuotePurchaseTypeComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
