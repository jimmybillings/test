import { OrdersStore } from './orders.store';

export function main() {
  describe('Orders Store', () => {
    let storeUnderTest: OrdersStore;

    beforeEach(() => {
      storeUnderTest = new OrdersStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

