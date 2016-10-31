import { OrderStore } from './order.store';

export function main() {
  describe('Order Store', () => {
    let storeUnderTest: OrderStore;

    beforeEach(() => {
      storeUnderTest = new OrderStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

