import { OrderItemListComponent } from './order-item-list.component';

export function main() {
  describe('Order Item List Component', () => {
    let componentUnderTest: OrderItemListComponent;

    beforeEach(() => {
      componentUnderTest = new OrderItemListComponent();
    });

    describe('Instance of component', () => {
      it('Should be true', () => {
        expect(componentUnderTest instanceof OrderItemListComponent).toBeTruthy();
      });
    });
    
  });
};

