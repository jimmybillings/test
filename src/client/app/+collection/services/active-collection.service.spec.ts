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
  describe('Collections service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should have a getFocusedCollection method that gets a users focused collection',
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

    it('Should have a setFocusedCollection method that sets a users focused collection given an id',
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

    it('Should have a addAssetsToCollection method that adds assets to a collection',
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
  });
}
