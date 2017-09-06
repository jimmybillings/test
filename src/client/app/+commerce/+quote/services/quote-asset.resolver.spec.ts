import { QuoteAssetResolver } from './quote-asset.resolver';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Quote Asset Resolver', () => {
    const mockRoute: any = { params: { uuid: 'abc-123' } };
    const mockState: any = undefined;
    let resolverUnderTest: QuoteAssetResolver, mockStore: MockAppStore, loadSpy: jasmine.Spy, resolved: jasmine.Spy;

    beforeEach(() => {
      mockStore = new MockAppStore();
      loadSpy = mockStore.createActionFactoryMethod('quoteAsset', 'load');
      resolved = jasmine.createSpy('resolved');
      resolverUnderTest = new QuoteAssetResolver(mockStore);
    });

    describe('resolve()', () => {
      it('should dispatch the proper action', () => {
        resolverUnderTest.resolve(mockRoute);

        expect(loadSpy).toHaveBeenCalledWith({ uuid: 'abc-123' });
      });

      it('Should not resolve if the Quote Asset store has no data from the server', () => {
        mockStore.createStateSection('quoteAsset', { loading: true });

        resolverUnderTest.resolve(mockRoute).subscribe(resolved);

        expect(resolved).not.toHaveBeenCalled();
      });

      it('Should resolve if the Quote Asset store already has data from the server', () => {
        mockStore.createStateSection('quoteAsset', { loading: false });

        resolverUnderTest.resolve(mockRoute).subscribe(resolved);

        expect(resolved).toHaveBeenCalled();
      });
    });
  });
};
