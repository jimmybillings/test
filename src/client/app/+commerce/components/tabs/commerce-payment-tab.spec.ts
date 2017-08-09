import { CommercePaymentTab } from './commerce-payment-tab';

export function main() {
  xdescribe('Payment Tab Component', () => {
    let componentUnderTest: CommercePaymentTab;

    beforeEach(() => {
      componentUnderTest = new CommercePaymentTab(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
