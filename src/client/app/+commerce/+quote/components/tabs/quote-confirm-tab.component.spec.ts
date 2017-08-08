import { QuoteConfirmTabComponent } from './quote-confirm-tab.component';

export function main() {
  xdescribe('Quote Confirm Tab Component', () => {
    let componentUnderTest: QuoteConfirmTabComponent;

    beforeEach(() => {
      componentUnderTest = new QuoteConfirmTabComponent(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
