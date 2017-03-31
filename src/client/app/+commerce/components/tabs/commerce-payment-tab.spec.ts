import { CommercePaymentTab } from './commerce-payment-tab';

export function main() {
  describe('Payment Tab Component', () => {
    let componentUnderTest: CommercePaymentTab;

    beforeEach(() => {
      componentUnderTest = new CommercePaymentTab(null, null, null, null);
    });

    it('has no functionality yet', () => {
      expect(true).toBe(true);
    });
  });
};
