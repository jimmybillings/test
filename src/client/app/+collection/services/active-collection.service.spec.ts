import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  Observable,
  TestBed
} from '../../imports/test.imports';

import { ActiveCollectionService, collectionSummary } from './active-collection.service';

export function main() {
  describe('Active Collections service', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));

    it('Should get the current active collection and save it in the store',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'updateActiveCollectionStore');
        service.get().subscribe(response => {
          expect(connection.request.url.split('.com')[1]).toBe('/api/assets/v1/collectionSummary/focused');
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
        spyOn(service, 'updateActiveCollectionStore');
        service.set(158).subscribe(response => {
          expect(connection.request.url.split('.com')[1]).toBe('/api/assets/v1/collectionSummary/setFocused/158');
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
        service.addAsset(158, { 'assetId': 567890 }).subscribe(response => {
          expect(connection.request.url.split('.com')[1]).toBe('/api/identities/v1/collection/158/addAssets');
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
        spyOn(service, 'removeAssetFromStore');
        service.removeAsset(158, 1, 13213123).subscribe(response => {
          expect(connection.request.url.split('.com')[1]).toBe('/api/identities/v1/collection/158/removeAssets');
          expect(response).toEqual({ list: [{ assetId: 1 }] });
          expect(service.removeAssetFromStore).toHaveBeenCalledWith({ assetId: 1 });
        });

        connection.mockRespond(new Response(
          new ResponseOptions({
            body: {
              list: [
                { assetId: 1 }
              ]
            }
          })
        ));
      }));

    it('Get search assets for a given collection id and n per page',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'updateActiveCollectionAssets');
        service.getItems(1, { i: 0, n: 100 }).subscribe(response => {
          expect(connection.request.url.split('.com')[1]).toBe('/api/assets/v1/collectionSummary/assets/1?i=0&n=100');
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
        service.addAssetToStore({ asset: 1 });
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'ADD_ASSET_TO_COLLECTION', payload: { asset: 1 } });
      }));

    it('Should remove an asset from the active collection store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.removeAssetFromStore({ asset: 1 });
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: { asset: 1 } });
      }));

    it('Should create a correctly formatted collection summary object to put in the store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        var summary = collectionSummary(mockCollectionResponse());
        expect(Object.keys(summary)).toEqual(collectionSummaryKeys());
      }));

    it('Should update the active collection store with a new collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.updateActiveCollectionStore(mockCollectionResponse());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: collectionSummary(mockCollectionResponse()) });
      }));

    it('Should reset the acitve collection store to a default value',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        spyOn(service.store, 'dispatch');
        service.resetStore();
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'RESET_ACTIVE_COLLECTION' });
      }));

    it('Should check if a collection id matches the current active collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        service.data = Observable.of({ 'id': 1 });
        expect(service.isActiveCollection(1)).toEqual(true);
      }));

    it('Should check that a collection id does not match the current active collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        service.data = Observable.of({ 'id': 1 });
        expect(service.isActiveCollection(3)).toEqual(false);
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
        }
      };
    }

    function mockCollectionResponse() {
      return {
        'lastUpdated': '2016-07-21T18:06:18Z',
        'createdOn': '2016-06-14T00:59:33Z',
        'id': 158,
        'siteName': 'core',
        'name': 'Alternative Energy',
        'owner': 5,
        'email': 'jeff@jeffhyde.com',
        'editors': [50, 62],
        'assets': [
          {
            'uuid': '147819dc-d5ef-4b50-8156-ef1add7c609c',
            'assetId': 37533069,
            'createdOn': '2016-06-28T20:36:31Z',
            'lastUpdated': '2016-07-21T18:06:18Z'
          },
        ],
        'tags': ['solar', 'wind', 'DC']
      };
    }

    function collectionSummaryKeys() {
      return [
        'createdOn',
        'lastUpdated',
        'id',
        'siteName',
        'name',
        'owner',
        'email',
        'userRole',
        'editors',
        'collectionThumbnail',
        'tags',
        'assetsCount'
      ];
    }
  });
}
