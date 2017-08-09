import { QuoteBillingTabComponent } from './quote-billing-tab.component';

export function main() {
  xdescribe('Quote Billing Tab Component', () => {
    let componentUnderTest: QuoteBillingTabComponent;

    beforeEach(() => {
      componentUnderTest = new QuoteBillingTabComponent(null, null, null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
