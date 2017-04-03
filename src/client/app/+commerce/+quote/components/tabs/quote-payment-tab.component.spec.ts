import { QuotePaymentTabComponent } from './quote-payment-tab.component';

export function main() {
  describe('Quote Payment Tab Component', () => {
    let componentUnderTest: QuotePaymentTabComponent;

    beforeEach(() => {
      componentUnderTest = new QuotePaymentTabComponent(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
