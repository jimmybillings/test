import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../../imports/test.imports';

import { CollectionsService } from './collections.service';
import { CollectionsStore } from '../stores/collections.store';

export function main() {
  describe('Collections service', () => {
    let mockStore: any;

    beforeEach(() => {
      mockStore = {
        deleteAllCollections: jasmine.createSpy('deleteAllCollections'),
        deleteCollectionWith: jasmine.createSpy('deleteCollectionWith'),
        add: jasmine.createSpy('add'),
        update: jasmine.createSpy('update'),
        replaceAllCollectionsWith: jasmine.createSpy('replaceAllCollectionsWith'),
        state: { id: 1 }
      };

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          { provide: CollectionsStore, useValue: mockStore }
        ]
      });
    });

    // it('Should create instance variable for data',
    //   inject([CollectionsService], (service: CollectionsService) => {
    //     expect(service.data).toBeDefined();
    //   }));

    it('Should have a loadCollections method that gets the users collections',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.load().subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary/search?q=&accessLevel=all&s=&d=&i=0&n=200') !== -1).toBe(true);
          expect(response).toEqual(mockCollection());
          expect(mockStore.replaceAllCollectionsWith).toHaveBeenCalledWith(mockCollection());
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
        service.create(mockCollection()).subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary') !== -1).toBe(true);
          expect(response).toEqual(mockCollection());
          expect(mockStore.add).toHaveBeenCalledWith(mockCollection());
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
        service.delete(158).subscribe(response => {
          expect(connection.request.url.indexOf('/api/identities/v1/collection/158') !== -1).toBe(true);
          expect(mockStore.deleteCollectionWith).toHaveBeenCalledWith(158);
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
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

