import { OrdersResolver } from './orders.resolver';

export function main() {
  describe('Orders Resolver', () => {
    let resolverUnderTest: OrdersResolver;

    beforeEach(() => {
      resolverUnderTest = new OrdersResolver(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

