import { Observable } from 'rxjs/Observable';

import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { OrderAssetResolver } from './order-asset.resolver';

export function main() {
  describe('Order Asset Resolver', () => {
    let mockStore: MockAppStore;
    let resolverUnderTest: OrderAssetResolver;

    beforeEach(() => {
      mockStore = new MockAppStore();
      resolverUnderTest = new OrderAssetResolver(mockStore);
    });

    describe('resolve()', () => {
      let mockRoute: any;
      let loadSpy: jasmine.Spy;
      let resolverSubscriptionFunction: jasmine.Spy;

      beforeEach(() => {
        mockRoute = { params: { orderId: '1234', uuid: 'ABCD' } };
        loadSpy = mockStore.createActionFactoryMethod('orderAsset', 'load');
        resolverSubscriptionFunction = jasmine.createSpy('resolver subscription function');
        mockStore.createStateSection('orderAsset', { activeOrderAsset: { id: 5678 }, loading: true });
      });

      it('dispatches an action', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        mockStore.expectDispatchFor(loadSpy, 1234, { uuid: 'ABCD' });
      });

      it('doesn\'t return when the loading flag is true', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        expect(resolverSubscriptionFunction).not.toHaveBeenCalled();
      });

      it('returns when the loading flag is false', () => {
        mockStore.createStateSection('orderAsset', { activeOrderAsset: { id: 1234 }, loading: false });

        resolverUnderTest.resolve(mockRoute).subscribe(resolverSubscriptionFunction);

        expect(resolverSubscriptionFunction).toHaveBeenCalledWith(true);
      });
    });
  });
};
