import {
  beforeEachProvidersArray,
  beforeEachProviders,
  ResponseOptions,
  MockBackend,
  Response,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { ActiveCollectionService } from './active-collection.service';

export function main() {
  describe('Active Collections service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should get the current active collection and save it in the store',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        spyOn(service, 'updateActiveCollectionStore');
        service.get().subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/focused');
          expect(service.updateActiveCollectionStore).toHaveBeenCalledWith(mockCollectionResponse());
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should set the current active collection with the given ID and save it to the store',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        spyOn(service, 'updateActiveCollectionStore');
        service.set(158).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/focused/158');
          expect(service.updateActiveCollectionStore).toHaveBeenCalledWith(mockCollectionResponse());
          expect(response.id).toEqual(158);
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should add an asset to a collection with the given collectionId and asset',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.addAsset(158, { 'assetId': 567890 }).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/158/addAssets');
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should remove an asset from a collection with the given collectionId, assetId and uuid',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        spyOn(service, 'removeAssetFromStore');
        service.removeAsset(158, 1, 13213123).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/158/removeAssets');
          expect(response).toEqual({list: [{assetId: 1}]});
          expect(service.removeAssetFromStore).toHaveBeenCalledWith({assetId: 1});
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: {list: [
                {assetId: 1}
              ]}
          })
        ));
      }));

    it('Get search assets for a given collection id and n per page',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'updateActiveCollectionAssets');
        service.getItems(1, 100).subscribe(response => {
          expect(connection.request.url).toBe(
            'https://crxextapi.dev.wzplatform.com/api/assets/v1/search/collection/1?i=0&n=100');
          expect(response).toEqual(mockCollectionResponse());
          expect(service.updateActiveCollectionAssets).toHaveBeenCalledWith(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should add an asset to the active collection store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.addAssetToStore({asset: 1});
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'ADD_ASSET_TO_COLLECTION', payload: {asset: 1} });
      }));

    it('Should remove an asset from the active collection store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.removeAssetFromStore({asset: 1});
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: {asset: 1} });
      }));

    it('Should update the active collection store with a new collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.updateActiveCollectionStore(mockCollectionResponse());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: activeState(mockCollectionResponse()) });
      }));

    it('Should reset the acitve collection store to a default value',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.resetStore();
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'RESET_ACTIVE_COLLECTION' });
      }));

    it('Should add an asset to the active collection store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');

        service.updateActiveCollectionAssets(assets());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: assetsInStore() });
      }));

    function assets(): any {
      return {
          items: [],
          totalCount: 0,
          currentPage: 0,
          pageSize: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          numberOfPages: 1
        };
     }

    function assetsInStore(): any {
      return {
        assets: {
          items: [],
          pagination: {
            totalCount: 0,
            currentPage: 1,
            pageSize: 10,
            hasNextPage: false,
            hasPreviousPage: false,
            numberOfPages: 1
          }
        },
        thumbnail: ''
      };
    }

    function mockCollectionResponse() {
      return {
        'createdOn': '2016-06-03T17:09:16Z',
        'lastUpdated': '2016-06-24T03:14:14Z',
        'id': 158,
        'siteName': 'core',
        'name': 'Masters Opening Cerimony',
        'owner': 'admin@wazeedigital.com',
        'items': [
          {
            'createdOn': '2016-06-16T17:53:17Z',
            'lastUpdated': '2016-06-16T17:53:17Z',
            'id': 155, 'siteName': 'core',
            'name': 'Cat',
            'owner': 'ross.edfort@wazeedigital.com',
            'assets': [28296444],
            'tags': ['meow']
          }
        ],
        'totalCount': 2,
        'currentPage': 0,
        'pageSize': 2,
        'hasNextPage': false,
        'hasPreviousPage': false,
        'numberOfPages': 1
      };
    }

    function activeState(collection: any = {}): any {
      return {
        createdOn: collection.createdOn || '',
        lastUpdated: collection.lastUpdated || '',
        id: collection.id || null,
        siteName: collection.siteName || '',
        name: collection.name || '',
        owner: collection.owner || '',
        assets: {
          items: [],
          pagination: {
            totalCount: 0,
            currentPage: 1,
            pageSize: 100,
            hasNextPage: false,
            hasPreviousPage: false,
            numberOfPages: 0
          },
        },
        tags: collection.tags || []
      };
    }
  });
}
