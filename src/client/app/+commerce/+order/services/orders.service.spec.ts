import { OrdersService } from './orders.service';

export function main() {
  describe('Orders Service', () => {
    let serviceUnderTest: OrdersService;

    beforeEach(() => {
      serviceUnderTest = new OrdersService(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

