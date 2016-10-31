import { OrderItemListComponent } from './order-item-list.component';

export function main() {
  describe('Order Item List Component', () => {
    let componentUnderTest: OrderItemListComponent;

    beforeEach(() => {
      componentUnderTest = new OrderItemListComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

