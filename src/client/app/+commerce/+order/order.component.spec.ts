import { Observable } from 'rxjs/Rx';

import { OrderComponent } from './order.component';

export function main() {
  describe('Order Component', () => {
    let componentUnderTest: OrderComponent;
    let mockOrderService: any;

    beforeEach(() => {
      mockOrderService = {
        data: Observable.of({ someData: 'SOME_VALUE' })
      };

      componentUnderTest = new OrderComponent(mockOrderService);
    });
  });
};
