import { PricingService } from './pricing.service';

export function main() {
  xdescribe('Pricing Service', () => {
    let serviceUnderTest: PricingService;

    beforeEach(() => {
      serviceUnderTest = new PricingService(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
