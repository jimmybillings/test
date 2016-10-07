import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../../imports/test.imports';

import { CollectionsService } from './collections.service';

export function main() {
  describe('Collections service', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls, and collections',
      inject([CollectionsService], (service: CollectionsService) => {
        expect(service.api).toBeDefined();
        expect(service.apiUrls).toBeDefined();
        expect(service.data).toBeDefined();
      }));

    it('Should have a loadCollections method that gets the users collections',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'storeCollections');
        service.loadCollections().subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary/search?q=&accessLevel=all&s=&d=&i=0&n=200') !== -1).toBe(true);
          expect(response).toEqual(mockCollection());
          expect(service.storeCollections).toHaveBeenCalledWith(mockCollection());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a createCollection method that creates a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'createCollectionInStore');
        service.createCollection(mockCollection()).subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary') !== -1).toBe(true);
          expect(response).toEqual(mockCollection());
          expect(service.createCollectionInStore).toHaveBeenCalledWith(mockCollection());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a deleteCollection method that deletes a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service, 'deleteCollectionFromStore');
        service.deleteCollection(158).subscribe(response => {
          expect(connection.request.url.indexOf('/api/identities/v1/collection/158') !== -1).toBe(true);
          expect(service.deleteCollectionFromStore).toHaveBeenCalledWith(158);
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a destroyCollections method that sets the store back to its initial state',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.destroyCollections();
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'RESET_COLLECTIONS' });
      }));

    it('Should delete a collection from the store by the given collection id',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.deleteCollectionFromStore(2);
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'DELETE_COLLECTION', payload: 2 });
      }));

    it('Should create a collection in the store by passing in the given collection object',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.createCollectionInStore(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'CREATE_COLLECTION', payload: mockCollection() });
      }));

    it('Should update a collection in the store by passing in the given collection object',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.updateCollectionInStore(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'UPDATE_COLLECTION', payload: mockCollection() });
      }));

    function mockCollection() {
      return {
        'lastUpdated': '2016-06-17T21:44:12Z',
        'createdOn': '2016-06-17T21:44:12Z',
        'id': 158,
        'siteName': 'core',
        'name': 'golf',
        'owner': 33,
        'email': 'joe@doe.com',
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

