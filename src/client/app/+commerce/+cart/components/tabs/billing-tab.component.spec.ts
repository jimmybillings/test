import { BillingTabComponent } from './billing-tab.component';

export function main() {
  describe('Billing Tab Component', () => {
    let componentUnderTest: BillingTabComponent;

    beforeEach(() => {
      componentUnderTest = new BillingTabComponent(null, null, null, null, null, null);
    });

    it('has no functionality yet', () => {
      expect(true).toBe(true);
    });
  });
};
