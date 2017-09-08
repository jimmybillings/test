import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { CartResolver } from './cart.resolver';

export function main() {
  describe('Cart Resolver', () => {
    let mockStore: MockAppStore;
    let resolverUnderTest: CartResolver;

    beforeEach(() => {
      mockStore = new MockAppStore();
      resolverUnderTest = new CartResolver(mockStore);
    });

    describe('resolve()', () => {
      let loadSpy: jasmine.Spy;
      let resolverSubscriptionFunction: jasmine.Spy;

      beforeEach(() => {
        loadSpy = mockStore.createActionFactoryMethod('cart', 'load');
        resolverSubscriptionFunction = jasmine.createSpy('resolver subscription function');
        mockStore.createStateSection('cart', { loading: true });
      });

      it('dispatches an action', () => {
        resolverUnderTest.resolve().subscribe(resolverSubscriptionFunction);
        mockStore.expectDispatchFor(loadSpy);
      });

      it('doesn\'t return when the loading flag is true', () => {
        resolverUnderTest.resolve().subscribe(resolverSubscriptionFunction);
        expect(resolverSubscriptionFunction).not.toHaveBeenCalled();
      });

      it('returns when the loading flag is false', () => {
        mockStore.createStateSection('cart', { loading: false });
        resolverUnderTest.resolve().subscribe(resolverSubscriptionFunction);
        expect(resolverSubscriptionFunction).toHaveBeenCalledWith(true);
      });
    });
  });
};
