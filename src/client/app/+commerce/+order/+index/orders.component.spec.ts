import { OrdersComponent } from './orders.component';

export function main() {
  describe('Orders Component', () => {
    let componentUnderTest: OrdersComponent;

    beforeEach(() => {
      componentUnderTest = new OrdersComponent(null,null,null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

