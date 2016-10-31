import { OrderService } from './order.service';

export function main() {
  describe('Order Service', () => {
    let serviceUnderTest: OrderService;

    beforeEach(() => {
      serviceUnderTest = new OrderService(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

