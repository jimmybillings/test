import { Observable } from 'rxjs/Observable';

import { OrderResolver } from './order.resolver';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Order Resolver', () => {
    let resolverUnderTest: OrderResolver;
    let mockRoute: any;
    let mockStore: MockAppStore;
    const mockOrderService: any = { getOrder: jasmine.createSpy('getOrder').and.returnValue(Observable.of({ some: 'order' })) };

    beforeEach(() => {
      mockRoute = { params: { orderId: '1234' } };
      mockStore = new MockAppStore();
      resolverUnderTest = new OrderResolver(mockOrderService, mockStore);
    });

    describe('resolve()', () => {
      it('just returns Observable of true if the order is already in the store', () => {
        mockStore.createStateElement('order', 'activeOrder', { id: 1234 });
        const subscriptionFunction = jasmine.createSpy('subscription function');

        resolverUnderTest.resolve(mockRoute).subscribe(subscriptionFunction);

        expect(mockOrderService.getOrder).not.toHaveBeenCalled();
        expect(subscriptionFunction).toHaveBeenCalledWith(true);
      });

      it('should hit the service if the order is not already there', () => {
        mockStore.createStateElement('order', 'activeOrder', { id: 0 });
        const subscriptionFunction = jasmine.createSpy('subscription function');

        resolverUnderTest.resolve(mockRoute).subscribe(subscriptionFunction);

        expect(mockOrderService.getOrder).toHaveBeenCalledWith(1234);
        expect(subscriptionFunction).toHaveBeenCalledWith(true);
      });
    });
  });
};
