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

import { CollectionsService } from './collections.service';

export function main() {
  describe('Collections service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls, and collections',
      inject([CollectionsService], (service: CollectionsService) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.apiUrls).toBeDefined();
        expect(service.collections).toBeDefined();
      }));

    it('Should have a loadCollections method that gets the users collections',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'https://crxextapi.dev.wzplatform.com/api/assets/v1/search';
        let expectedUrl = service.apiUrls.CollectionBaseUrl + '/collectionSummary/fetchBy?access-level=all';
        service.loadCollections().subscribe(response => {
          expect(connection.request.url).toBe(expectedUrl);
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should have a createCollection method that creates a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.createCollection(mockCollection()).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection');
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    // it('Should have a getFocusedCollection method that gets a users focused collection',
    //   inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
    //     let connection: any;
    //     connection = mockBackend.connections.subscribe((c: any) => connection = c);
    //     service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
    //     service.getFocusedCollection().subscribe(response => {
    //       expect(connection.request.url).toBe('api/identites/v1/collection/focused');
    //       expect(response).toEqual(mockCollectionResponse());
    //     });
    //     connection.mockRespond(new Response(
    //       new ResponseOptions({
    //         body: mockCollectionResponse()
    //       })
    //     ));
    //   }));

    // it('Should have a setFocusedCollection method that sets a users focused collection given an id',
    //   inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
    //     let connection: any;
    //     connection = mockBackend.connections.subscribe((c: any) => connection = c);
    //     service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
    //     service.setFocusedCollection(158).subscribe(response => {
    //       expect(connection.request.url).toBe('api/identites/v1/collection/focused/158');
    //       expect(connection.request.method).toBe(RequestMethod.Put);
    //       expect(response).toEqual(mockCollection());
    //       expect(response.id).toEqual(158);
    //     });
    //     connection.mockRespond(new Response(
    //       new ResponseOptions({
    //         body: mockCollection()
    //       })
    //     ));
    //   }));

    // it('Should have a addAssetsToCollection method that adds assets to a collection',
    //   inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
    //     let connection: any;
    //     connection = mockBackend.connections.subscribe((c: any) => connection = c);
    //     service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
    //     service.addAssetsToCollection(158, { 'list': [{ 'assetId': 567890 }] }).subscribe(response => {
    //       expect(connection.request.method).toBe(RequestMethod.Post);
    //       expect(connection.request.url).toBe('api/identites/v1/collection/158/addAssets');
    //     });
    //     connection.mockRespond(new Response(
    //       new ResponseOptions({
    //         body: mockCollection()
    //       })
    //     ));
    //   }));

    it('Should have a deleteCollection method that deletes a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.deleteCollection(158).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/158');
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a clearCollections method that sets the store back to its initial state',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.destroyCollections();
        expect(service.store.dispatch).toHaveBeenCalled();
      }));

    it('Should have a deleteCollectionFromStore method that removes a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.deleteCollectionFromStore(mockCollection().id);
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'DELETE_COLLECTION', payload: mockCollection().id });
      }));

    // it('Should have an updateFocusedCollection method that updates the focused collection in the store',
    //   inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
    //     // spyOn(service.store, 'dispatch');
    //     service.updateFocusedCollectionAssets(mockcollectionAssetSearch());
    //     // expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'FOCUSED_COLLECTION', payload: mockcollectionWithAssets() });
    //   }));

    it('Should have a createCollectionInStore method that creates a new collection in the store',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.createCollectionInStore(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'CREATE_COLLECTION', payload: mockCollection() });
      }));

    function mockCollectionResponse() {
      return {
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

    // function mockcollectionAsset2() {
    //   return {
    //     'createdOn': '2016-06-03T17:09:16Z',
    //     'lastUpdated': '2016-06-24T03:14:14Z',
    //     'id': 16,
    //     'siteName': 'core',
    //     'name': 'Masters Opening Cerimony',
    //     'owner': 'admin@wazeedigital.com',
    //     'assets': {
    //       'items': [
    //         {
    //           'assetId': 37432110,
    //           'createdOn': '2016-06-24T03:14:14Z',
    //           'lastUpdated': '2016-06-24T03:14:14Z',
    //           'uuid': '8cb5197a-c9ba-4f98-a62a-ee4e40793ad9'
    //         }
    //       ],
    //       'pagination': {
    //         'totalCount': 1
    //       }
    //     },
    //     'tags': ['golf', 'masters', 'Augusta'],
    //     'thumbnail': {
    //       'name': 'thumbnail',
    //       'urls': {
    //         'https': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/943/301/943301_0040_lt.jpg'
    //       }
    //     },
    //   };
    // }
    // function mockcollectionAssetSearch() {
    //   return {
    //     'items': [
    //       {
    //         'assetId': 37432110,
    //         'metaData': [
    //           {
    //             'name': 'Title',
    //             'value': ''
    //           },
    //           {
    //             'name': 'Description',
    //             'value': 'A man paddles a kayak in the Arctic or Antarctic with an elephant seal on a nearby iceberg.'
    //           },
    //           {
    //             'name': 'TE.DigitalFormat',
    //             'value': 'High Definition'
    //           },
    //           {
    //             'name': 'Format.Duration',
    //             'value': '00:00:12'
    //           }
    //         ],
    //         'name': '943301_0040',
    //         'thumbnail': {
    //           'name': 'thumbnail',
    //           'urls': {
    //             'https': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/943/301/943301_0040_lt.jpg'
    //           }
    //         },
    //         'uuid': '8cb5197a-c9ba-4f98-a62a-ee4e40793ad9'
    //       },
    //     ],
    //     'totalCount': 1,
    //     'currentPage': 0,
    //     'pageSize': 100,
    //     'hasNextPage': false,
    //     'hasPreviousPage': false,
    //     'numberOfPages': 1
    //   };
    // }
    // function mockcollectionWithAssets() {
    //   return {
    //     'createdOn': '2016-06-03T17:09:16Z',
    //     'lastUpdated': '2016-06-24T03:14:14Z',
    //     'id': 16,
    //     'siteName': 'core',
    //     'name': 'Masters Opening Cerimony',
    //     'owner': 'admin@wazeedigital.com',
    //     'assets': {
    //       'items': [{
    //         'assetId': 37432110,
    //         'metaData': [
    //           {
    //             'name': 'Title',
    //             'value': ''
    //           },
    //           {
    //             'name': 'Description',
    //             'value': 'A man paddles a kayak in the Arctic or Antarctic with an elephant seal on a nearby iceberg.'
    //           },
    //           {
    //             'name': 'TE.DigitalFormat',
    //             'value': 'High Definition'
    //           },
    //           {
    //             'name': 'Format.Duration',
    //             'value': '00:00:12'
    //           }
    //         ],
    //         'name': '943301_0040',
    //         'thumbnail': {
    //           'name': 'thumbnail',
    //           'urls': {
    //             'https': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/943/301/943301_0040_lt.jpg'
    //           }
    //         },
    //         'uuid': '8cb5197a-c9ba-4f98-a62a-ee4e40793ad9'
    //       }],
    //       'pagination': {
    //         'totalCount': 1,
    //         'currentPage': 1,
    //         'pageSize': 100,
    //         'hasNextPage': false,
    //         'hasPreviousPage': false,
    //         'numberOfPages': 1
    //       },
    //     },
    //     'tags': ['golf', 'masters', 'Augusta'],
    //     'thumbnail': {
    //       'name': 'thumbnail',
    //       'urls': {
    //         'https': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/943/301/943301_0040_lt.jpg'
    //       }
    //     }
    //   };
    // }

    function mockCollection() {
      return {
        'lastUpdated': '2016-06-17T21:44:12Z',
        'createdOn': '2016-06-17T21:44:12Z',
        'id': 158,
        'siteName': 'core',
        'name': 'golf',
        'owner': 'ross.edfort@wazeedigital.com',
        'assets': {
          'items': [
            {
              'assetId': 31997574,
              'metaData': [
                {
                  'name': 'Title',
                  'value': ''
                },
                {
                  'name': 'Description',
                  'value': 'POV of woman driving down tree lined road, Tuscany, Italy'
                },
                {
                  'name': 'TE.DigitalFormat',
                  'value': 'High Definition'
                },
                {
                  'name': 'Format.Duration',
                  'value': '00:00:59'
                }
              ],
              'name': '962C823_816',
              'thumbnail': {
                'name': 'thumbnail',
                'urls': {
                  'https': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/962/C82/3/962C823_816_lt.jpg'
                }
              },
              'uuid': '99e4280d-c323-43c2-9e50-98514c7d74ca'
            }
          ],
          'pagination': {
            'totalCount': 1,
            'currentPage': 1,
            'pageSize': 100,
            'hasNextPage': false,
            'hasPreviousPage': false,
            'numberOfPages': 1
          }
        },
        'tags': ['golf', 'green', 'sport']
      };
    }
  });
}
