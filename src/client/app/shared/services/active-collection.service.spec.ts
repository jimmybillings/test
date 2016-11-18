import { ActiveCollectionService } from './active-collection.service';
import { Observable } from 'rxjs/Rx';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Collection } from '../interfaces/collection.interface';

export function main() {
  fdescribe('Active Collection Service', () => {
    let serviceUnderTest: ActiveCollectionService, mockApi: MockApiService, mockStore: any, collection: Collection;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockApi = new MockApiService();
      collection = {
        id: 1,
        createdOn: '123',
        lastUpdated: '456',
        siteName: 'core',
        name: 'cats',
        owner: 25,
        assets: {
          items: [
            { assetId: 123, uuid: 'abc' },
            { assetId: 456, uuid: 'def' },
            { assetId: 789, uuid: 'ghi' }
          ]
        }
      };
      mockStore = {
        data: Observable.of(collection),
        state: collection,
        reset: jasmine.createSpy('reset'),
        remove: jasmine.createSpy('remove'),
        updateTo: jasmine.createSpy('updateTo'),
        updateAssetsTo: jasmine.createSpy('updateAssetsTo')
      };
      serviceUnderTest = new ActiveCollectionService(mockStore, mockApi.injector);
    });

    describe('OnInit', () => {
      it('should set the searchParams', () => {
        serviceUnderTest.ngOnInit();

        expect(serviceUnderTest.params).toEqual({ 's': '', 'd': '', 'i': '0', 'n': '50' });
      });
    });

    describe('Data and state getters', () => {
      it('state should call state on the store and return a collection', () => {
        expect(serviceUnderTest.state).toEqual(collection);
      });

      it('data should call data on the store and return an observable of a collection', () => {
        expect(serviceUnderTest.data).toEqual(Observable.of(collection));
      });
    });

    describe('resetStore', () => {
      it('should call .reset() on the store', () => {
        serviceUnderTest.resetStore();

        expect(mockStore.reset).toHaveBeenCalled();
      });
    });

    describe('isActiveCollection', () => {
      it('should return true when the collectionId passed in matches the one in the store', () => {
        expect(serviceUnderTest.isActiveCollection(1)).toBe(true);
      });

      it('should return false when the collectionId passed in does not mathc the one in the store', () => {
        expect(serviceUnderTest.isActiveCollection(123)).toBe(false);
      });
    });

    describe('load', () => {
      describe('with no parameters', () => {
        it('should get the focusedCollection summary if a collectionId is not passed in', () => {
          serviceUnderTest.load();

          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('collectionSummary/focused');
          expect(mockApi.get).toHaveBeenCalledWithLoading();
        });

        it('should call updateTo on the store with the response', () => {
          serviceUnderTest.load().take(1).subscribe((response: any) => {
            expect(mockStore.updateTo).toHaveBeenCalledWith(mockApi.getResponse);
          });
        });

        // it('should call getItems with the response id', () => {
        //   mockApi.getResponse = [collection, [{ assetId: 1 }, { assetId: 2 }, { assetId: 3 }]];
        //   spyOn(serviceUnderTest, 'getItems');

        //   serviceUnderTest.load().take(1).subscribe((response: Collection) => {
        //     expect(serviceUnderTest.getItems).toHaveBeenCalledWith(1, {i: 1, n: 100 });
        //   });
        // });
      });

      // This block is essentialy a spec for ActiveCollectionService::set
      describe('a collectionId is passed in should call set()', () => {
        beforeEach(() => {
          spyOn(serviceUnderTest, 'getItems');
          serviceUnderTest.load(321);
        });

        it('should call the api service correctly', () => {
          expect(mockApi.put).toHaveBeenCalledWithApi(Api.Assets);
          expect(mockApi.put).toHaveBeenCalledWithEndpoint('collectionSummary/setFocused/321');
          expect(mockApi.put).toHaveBeenCalledWithLoading();
        });

        it('should call getItems', () => {
          expect(serviceUnderTest.getItems).toHaveBeenCalledWith(321, { i: 0, n: 100 }, false);
        });
      });

      describe('with collectionId and params passed in', () => {
        it('should use the params for getItems() in .set()', () => {
          spyOn(serviceUnderTest, 'getItems');
          serviceUnderTest.load(100, { i: 12, n: 50 });

          expect(serviceUnderTest.getItems).toHaveBeenCalledWith(100, { i: 12, n: 50 }, false);
        });
      });
    });

    describe('AddAsset', () => {
      beforeEach(() => {
        mockApi.postResponse = collection;
      });

      it('should call the apiService correctly', () => {
        serviceUnderTest.addAsset(1, { assetId: 12 });

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('collection/1/addAssets');
        expect(mockApi.post).toHaveBeenCalledWithBody({ list: [{ assetId: 12 }] });
      });

      // it('should call getItems in the flatMap', () => {
      //   spyOn(serviceUnderTest, 'getItems');
      //   serviceUnderTest.addAsset(1, { assetId: 12 }).take(1).subscribe();

      //   expect(serviceUnderTest.getItems).toHaveBeenCalledWith(1, { i: 1, n: 100 });
      // });
    });

    describe('RemoveAsset', () => {
      // There are 4 potential cases here -
        // 1. Asset has a UUID -and- it's in the collection
        // 2. Asset has a UUID -and- it's not in the collection
        // 2. Asset does not have a UUID -and- it's in the collection
        // 3. Asset does not have a UUID -and- it's not in the collection
      beforeEach(() => {
        mockApi.postResponse = { list: [{ assetId: 1 }, { assetId: 2 }, { assetId: 3 }] };
      });

      describe('Asset has a uuid and it is in the collection', () => {
        it('should call the apiService correctly', () => {
          serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 123, uuid: 'abc' } });

          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('collection/1/removeAssets');
          expect(mockApi.post).toHaveBeenCalledWithBody({ list: [{ assetId: 123, uuid: 'abc' }] });
        });

        it('should call remove on the store to remove the asset that was deleted', () => {
          serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 123, uuid: 'abc' } }).take(1).subscribe();

          expect(mockStore.remove).toHaveBeenCalled();
        });
      });

      describe('Asset does not have a UUID, but it is in the collection', () => {
        it('should call the apiService correctly', () => {
          serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 123 } });

          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('collection/1/removeAssets');
          expect(mockApi.post).toHaveBeenCalledWithBody({ list: [{ assetId: 123, uuid: 'abc' }] });
        });

        it('responds with the list of assets in the collection after removal', () => {
          let result: any = serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 123 } });

          result.take(1).subscribe((data: any) => {
            expect(data).toEqual({ list: [{ assetId: 1 }, { assetId: 2 }, { assetId: 3 }] });
          });
        });
      });

      describe('Asset has a uuid but it is not in the collection', () => {
        it('should return an empty observable', () => {
          let result: any = serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 987, uuid: 'xyz' } });

          result.take(1).subscribe((data: any) => {
            expect(data).toEqual({});
          });
        });
      });

      describe('Asset does not have a uuid and it is not in the collection ', () => {
        it('should return an empty observable', () => {
          let result: any = serviceUnderTest.removeAsset({ collection: collection, asset: { assetId: 987 } });

          result.take(1).subscribe((data: any) => {
            expect(data).toEqual({});
          });
        });
      });
    });
  });
}