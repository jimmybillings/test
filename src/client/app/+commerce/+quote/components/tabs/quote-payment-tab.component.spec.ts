import { QuotePaymentTabComponent } from './quote-payment-tab.component';

export function main() {
  xdescribe('Quote Payment Tab Component', () => {
    let componentUnderTest: QuotePaymentTabComponent;

    beforeEach(() => {
      componentUnderTest = new QuotePaymentTabComponent(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
