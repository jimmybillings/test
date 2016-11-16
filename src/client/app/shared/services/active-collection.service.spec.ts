import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  Observable,
  TestBed
} from '../../imports/test.imports';

import { ActiveCollectionService } from './active-collection.service';
import { ActiveCollectionStore } from '../stores/active-collection.store';
import { Collection } from '../interfaces/collection.interface';

export function main() {
  describe('Active Collections service', () => {
    let mockStore: any;

    beforeEach(() => {
      mockStore = {
        add: jasmine.createSpy('add'),
        remove: jasmine.createSpy('remove'),
        updateTo: jasmine.createSpy('updateTo'),
        reset: jasmine.createSpy('reset'),
        updateAssetsTo: jasmine.createSpy('updateAssetsTo'),
        state: { id: 1 }
      };

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          { provide: ActiveCollectionStore, useValue: mockStore }
        ]
      });
    });

    it('Should get the current active collection and save it in the store',
      inject([ActiveCollectionService, MockBackend], (service: ActiveCollectionService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.get().subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary/focused') !== -1).toBe(true);
          expect(mockStore.updateTo).toHaveBeenCalledWith(mockCollectionResponse());
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
        service.set(158).subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary/setFocused/158') !== -1).toBe(true);
          expect(mockStore.updateTo).toHaveBeenCalledWith(mockCollectionResponse());
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
          expect(connection.request.url.indexOf('/api/identities/v1/collection/158/addAssets') !== -1).toBe(true);
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
        service.removeAsset(158, 1, 13213123).subscribe(response => {
          expect(connection.request.url.indexOf('/api/identities/v1/collection/158/removeAssets') !== -1).toBe(true);
          expect(response).toEqual({ list: [{ assetId: 1 }] });
          expect(mockStore.remove).toHaveBeenCalledWith({ assetId: 1 });
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
        service.getItems(1, { i: 0, n: 100 }).subscribe(response => {
          expect(connection.request.url.indexOf('/api/assets/v1/collectionSummary/assets/1?i=0&n=100') !== -1).toBe(true);
          expect(response).toEqual(mockCollectionResponse());
          expect(mockStore.updateAssetsTo).toHaveBeenCalledWith(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should create a correctly formatted collection summary object to put in the store',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        var summary = collectionSummary(mockCollectionResponse());
        expect(Object.keys(summary)).toEqual(collectionSummaryKeys());
      }));

    it('Should check if a collection id matches the current active collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        expect(service.isActiveCollection(1)).toEqual(true);
      }));

    it('Should check that a collection id does not match the current active collection',
      inject([ActiveCollectionService], (service: ActiveCollectionService) => {
        expect(service.isActiveCollection(3)).toEqual(false);
      }));

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

    function collectionSummary(collection: any = {}): Collection {
      return {
        createdOn: collection.createdOn || '',
        lastUpdated: collection.lastUpdated || '',
        id: collection.id || null,
        siteName: collection.siteName || '',
        name: collection.name || '',
        owner: collection.owner || 0,
        email: collection.email || '',
        userRole: collection.userRole || '',
        editors: collection.editors || [],
        collectionThumbnail: collection.collectionThumbnail || {},
        tags: collection.tags || [],
        assetsCount: collection.assetsCount || 0
      };
    }
  });
}
