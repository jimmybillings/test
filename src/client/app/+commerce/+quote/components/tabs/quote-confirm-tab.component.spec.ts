import { QuoteConfirmTabComponent } from './quote-confirm-tab.component';

export function main() {
  describe('Quote Confirm Tab Component', () => {
    let componentUnderTest: QuoteConfirmTabComponent;

    beforeEach(() => {
      componentUnderTest = new QuoteConfirmTabComponent(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
