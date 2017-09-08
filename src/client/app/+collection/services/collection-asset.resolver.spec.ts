import { CollectionAssetResolver } from './collection-asset.resolver';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Collection Asset Resolver', () => {
    let resolverUnderTest: CollectionAssetResolver, mockStore: MockAppStore, loadSpy: jasmine.Spy;
    const mockRoute: any = { params: { uuid: 'abc-123' } };

    beforeEach(() => {
      mockStore = new MockAppStore();
      loadSpy = mockStore.createActionFactoryMethod('activeCollectionAsset', 'load');
      resolverUnderTest = new CollectionAssetResolver(mockStore);
    });

    describe('resolve()', () => {
      it('should dispatch the proper action', () => {
        resolverUnderTest.resolve(mockRoute);

        expect(loadSpy).toHaveBeenCalledWith('abc-123');
      });

      it('Should not resolve if the Collection Asset store has no data from the server', () => {
        mockStore.createStateSection('activeCollectionAsset', { loading: true });

        expect(() => {
          resolverUnderTest.resolve(mockRoute).take(1).subscribe((data) => {
            throw new Error();
          });
        }).not.toThrow();
      });

      it('Should resolve if the Collection Asset store already has data from the server', () => {
        mockStore.createStateSection('activeCollectionAsset', { loading: false });

        resolverUnderTest.resolve(mockRoute).take(1).subscribe((data) => {
          expect(data).toEqual(true);
        });
      });
    });
  });
}
