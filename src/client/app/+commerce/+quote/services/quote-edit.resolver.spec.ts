import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { QuoteEditResolver } from './quote-edit.resolver';

export function main() {
  describe('Quote Edit Resolver', () => {
    let mockStore: MockAppStore;
    let resolverUnderTest: QuoteEditResolver;

    beforeEach(() => {
      mockStore = new MockAppStore();
      resolverUnderTest = new QuoteEditResolver(mockStore);
    });

    describe('resolve()', () => {
      let loadSpy: jasmine.Spy;
      let resolverSubscriptionFunction: jasmine.Spy;

      beforeEach(() => {
        loadSpy = mockStore.createActionFactoryMethod('quoteEdit', 'load');
        resolverSubscriptionFunction = jasmine.createSpy('resolver subscription function');
        mockStore.createStateSection('quoteEdit', { loading: true });
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
        mockStore.createStateSection('quoteEdit', { loading: false });
        resolverUnderTest.resolve().subscribe(resolverSubscriptionFunction);
        expect(resolverSubscriptionFunction).toHaveBeenCalledWith(true);
      });
    });
  });
};
