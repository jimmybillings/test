import { PaymentTabComponent } from './payment-tab.component';

export function main() {
  describe('Payment Tab Component', () => {
    let componentUnderTest: PaymentTabComponent;

    beforeEach(() => {
      componentUnderTest = new PaymentTabComponent(null, null, null, null);
    });

    it('has no functionality yet', () => {
      expect(true).toBe(true);
    });
  });
};
