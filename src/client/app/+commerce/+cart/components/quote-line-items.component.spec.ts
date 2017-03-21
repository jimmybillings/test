import { QuoteLineItemsComponent } from './quote-line-items.component';

export function main() {
  let componentUnderTest: QuoteLineItemsComponent;

  describe('Quote Line Items', () => {
    beforeEach(() => {
      componentUnderTest = new QuoteLineItemsComponent();
    });

    it('should have no functionality', () => {
      expect(true).toBe(true);
    });
  });
}
