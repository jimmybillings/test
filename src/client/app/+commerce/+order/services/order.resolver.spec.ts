import { Observable } from 'rxjs/Observable';

import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { OrderResolver } from './order.resolver';

export function main() {
  describe('Order Resolver', () => {
    let mockStore: MockAppStore;
    let resolverUnderTest: OrderResolver;

    beforeEach(() => {
      mockStore = new MockAppStore();
      resolverUnderTest = new OrderResolver(mockStore);
    });

    describe('resolve()', () => {
      let mockRoute: any;
      let loadSpy: jasmine.Spy;
      let resolverSubscriptionFunction: jasmine.Spy;

      beforeEach(() => {
        mockRoute = { params: { orderId: '1234' } };
        loadSpy = mockStore.createActionFactoryMethod('order', 'load');
        resolverSubscriptionFunction = jasmine.createSpy('resolver subscription function');
        mockStore.createStateSection('order', { activeOrder: { id: 5678 }, loading: true });
      });

      it('dispatches an action', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        mockStore.expectDispatchFor(loadSpy, 1234);
      });

      it('doesn\'t return when the loading flag is true', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        expect(resolverSubscriptionFunction).not.toHaveBeenCalled();
      });

      it('returns when the loading flag is false', () => {
        mockStore.createStateSection('order', { activeOrder: { id: 5678 }, loading: false });

        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        expect(resolverSubscriptionFunction).toHaveBeenCalledWith(true);
      });
    });
  });
};
