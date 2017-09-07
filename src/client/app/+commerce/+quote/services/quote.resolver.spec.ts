import { Observable } from 'rxjs/Observable';

import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { QuoteResolver } from './quote.resolver';

export function main() {
  describe('Quote Resolver', () => {
    let mockStore: MockAppStore;
    let resolverUnderTest: QuoteResolver;

    beforeEach(() => {
      mockStore = new MockAppStore();
      resolverUnderTest = new QuoteResolver(mockStore);
    });

    describe('resolve()', () => {
      let mockRoute: any;
      let loadSpy: jasmine.Spy;
      let resolved: jasmine.Spy;

      beforeEach(() => {
        mockRoute = { params: { quoteId: '1234' } };
        loadSpy = mockStore.createActionFactoryMethod('quoteShow', 'load');
        resolved = jasmine.createSpy('resolved');
        mockStore.createStateSection('quoteShow', { activeQuote: { id: 5678 }, loading: true });
      });

      it('dispatches an action', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolved);

        mockStore.expectDispatchFor(loadSpy, 1234);
      });

      it('doesn\'t return when the loading flag is true', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(resolved);

        expect(resolved).not.toHaveBeenCalled();
      });

      it('returns when the loading flag is false', () => {
        mockStore.createStateSection('quoteShow', { activeQuote: { id: 5678 }, loading: false });

        resolverUnderTest.resolve(mockRoute).subscribe(resolved);

        expect(resolved).toHaveBeenCalledWith(true);
      });
    });
  });
};
