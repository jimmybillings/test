import { Observable } from 'rxjs/Rx';

import { OrderShowComponent } from './order-show.component';

export function main() {
  describe('Order Show Component', () => {
    let componentUnderTest: OrderShowComponent;
    let mockOrderService: any;

    beforeEach(() => {
      mockOrderService = {
        data: Observable.of({ someData: 'SOME_VALUE' })
      };

      componentUnderTest = new OrderShowComponent(mockOrderService);
    });
  });
};
