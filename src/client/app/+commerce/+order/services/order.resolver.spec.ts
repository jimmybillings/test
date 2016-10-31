import { OrderResolver } from './order.resolver';

export function main() {
  describe('Order Resolver', () => {
    let resolverUnderTest: OrderResolver;

    beforeEach(() => {
      resolverUnderTest = new OrderResolver(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

