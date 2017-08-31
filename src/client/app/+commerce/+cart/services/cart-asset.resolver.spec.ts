import { CartAssetResolver } from './cart-asset.resolver';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Cart Asset Resolver', () => {
    const mockRoute: any = { params: { uuid: 'abc-123' } };
    const mockState: any = undefined;
    let resolverUnderTest: CartAssetResolver, mockStore: MockAppStore, loadSpy: jasmine.Spy;

    beforeEach(() => {
      mockStore = new MockAppStore();
      loadSpy = mockStore.createActionFactoryMethod('cartAsset', 'load');
      resolverUnderTest = new CartAssetResolver(mockStore);
    });

    describe('resolve()', () => {
      it('should dispatch the proper action', () => {
        resolverUnderTest.resolve(mockRoute, mockState);

        expect(loadSpy).toHaveBeenCalledWith({ uuid: 'abc-123' });
      });

      it('Should not resolve if the Cart Asset store has no data from the server', () => {
        mockStore.createStateSection('cartAsset', { loading: true });

        expect(() => {
          resolverUnderTest.resolve(mockRoute, mockState).take(1).subscribe((data) => {
            throw new Error();
          });
        }).not.toThrow();
      });

      it('Should resolve if the Cart Asset store already has data from the server', () => {
        mockStore.createStateSection('cartAsset', { loading: false });

        resolverUnderTest.resolve(mockRoute, mockState).take(1).subscribe((data) => {
          expect(data).toEqual(true);
        });
      });
    });
  });
};
