import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
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
        service.load().subscribe(response => {
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
        service.load(158, { i: 0, n: 100 }).subscribe(response => {
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
        service.removeAsset(mockAssetRemoveParams()).subscribe(response => {
          // expect(connection.request.url.indexOf('/api/identities/v1/collection/158/removeAssets') !== -1).toBe(true);
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

    function mockAssetRemoveParams() {
      return { 'collection': { 'createdOn': '2016-09-27T16:54:15Z', 'lastUpdated': '2016-11-16T23:15:05Z', 'id': 736, 'siteName': '', 'name': 'New Jersey', 'owner': 25, 'email': 'ross.edfort@wazeedigital.com', 'userRole': 'owner', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/447/213/25/44721325_093_lt.jpg' } }, 'assets': { 'items': [{ 'assetId': 8854627, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Dogs on leashes walk on ship deck; handler picks up dogs, hands them to woman.' }, { 'name': 'TE.DigitalFormat', 'value': 'Standard Definition' }, { 'name': 'Format.Duration', 'value': '00:00:22' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/480/500/59/48050059_6200_lt.jpg' } }, 'uuid': '76684d51-4808-4dda-bb1c-42c6a8b49b1b', 'hasDownloadableComp': true }, { 'assetId': 30886895, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Traffic curves around a freeway near Weehawken, New Jersey and toward the Lincoln Tunnel and New York City.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:01:55' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/341/3/3453413_169078_lt.jpg' } }, 'uuid': '86c2ac8f-a03f-42ee-8379-0941e332e202', 'hasDownloadableComp': true }, { 'assetId': 31308041, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'An FAA electronic radar map shows incoming flights over New Jersey, New York City, and Long Island.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:25' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/808/877/6/8088776_003_lt.jpg' } }, 'uuid': 'a84296b8-bad0-4678-b9f8-7c4834664791', 'hasDownloadableComp': true }, { 'assetId': 38448611, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Ducks in Island Beach State Park, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:31' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/447/213/25/44721325_093_lt.jpg' } }, 'uuid': '02c5f609-f2ad-42ef-a083-b5ba7c7f1fb4', 'hasDownloadableComp': true }, { 'assetId': 24825356, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'The Trenton Battle Monument stands in the heart of Trenton, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:05' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/305/8/3453058_127968_lt.jpg' } }, 'uuid': 'a079b016-6f01-497e-97ac-d06e97285735', 'hasDownloadableComp': true }, { 'assetId': 24825675, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Lights illuminate a New Jersey license plate on the back of a white sedan at night.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:03' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/305/8/3453058_128309_lt.jpg' } }, 'uuid': 'b085dc43-7457-498a-a271-4e773c2f87e9', 'hasDownloadableComp': true }, { 'assetId': 24825277, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'A bus turns a corner near  City Hall in Trenton, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:12' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/305/8/3453058_127774_lt.jpg' } }, 'uuid': 'a939edc0-0022-47db-b52b-493010c1598a', 'hasDownloadableComp': true }, { 'assetId': 24825295, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'The Lower Trenton Bridge spans the Delaware River in New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:06' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/305/8/3453058_127822_lt.jpg' } }, 'uuid': 'b4563d6d-4b9d-4fd9-bf4b-243e936102a8', 'hasDownloadableComp': true }, { 'assetId': 24825294, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'The Lower Trenton Bridge spans the Delaware River in New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:15' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/305/8/3453058_127811_lt.jpg' } }, 'uuid': '377f9610-bcae-4f85-aa0b-8099a6d1cd84', 'hasDownloadableComp': true }, { 'assetId': 23036993, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Airplanes taxi around Newark Liberty International Airport in Newark, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:20' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/303/003/303003_028_lt.jpg' } }, 'uuid': '7c2ea315-a53e-48f1-b198-22c8820d165a', 'hasDownloadableComp': true }, { 'assetId': 23036994, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'A highway runs close to Newark Liberty International Airport in Newark, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:15' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/303/003/303003_029_lt.jpg' } }, 'uuid': '63bfbc98-91eb-4217-b9a5-e656d2b480f3', 'hasDownloadableComp': true }, { 'assetId': 27958815, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'A residential street in Wayne, New Jersey, is covered by flood waters from the Passaic River.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:08' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/546/021/546021_011_lt.jpg' } }, 'uuid': '0d0c2369-a65c-4847-a7d9-3b67ba9ebe30', 'hasDownloadableComp': true }, { 'assetId': 32459020, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Excellent scenes of Atlantic City, New Jersey, in 1919.' }, { 'name': 'TE.DigitalFormat', 'value': 'Standard Definition' }, { 'name': 'Format.Duration', 'value': '00:02:08' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/000/943000_6672_lt.jpg' } }, 'uuid': '1f8fd011-4055-488d-b7ba-1d7f8d830316', 'hasDownloadableComp': true }, { 'assetId': 32459021, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Excellent scenes of Atlantic City, New Jersey, in 1919.' }, { 'name': 'TE.DigitalFormat', 'value': 'Standard Definition' }, { 'name': 'Format.Duration', 'value': '00:01:55' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/000/943000_6673_lt.jpg' } }, 'uuid': '7e116699-920c-4a0d-905b-68097234fb24', 'hasDownloadableComp': true }, { 'assetId': 26937075, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Wind blows through the grass on a dune next to the New Jersey shore.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:58' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/813/001/813001_038_lt.jpg' } }, 'uuid': '4db4bfad-d371-41f3-bb67-deec65d55ef3', 'hasDownloadableComp': true }, { 'assetId': 15916110, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'An outline of New Jersey fades into a map of the United States.' }, { 'name': 'TE.DigitalFormat', 'value': 'Standard Definition' }, { 'name': 'Format.Duration', 'value': '00:00:04' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/741/016/741016_029_lt.jpg' } }, 'uuid': '152f211a-8307-4fd9-83ed-14c22fedf26f', 'hasDownloadableComp': true }, { 'assetId': 26307591, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'New Jersey Governor Chris Christie talks with Michael Shear.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:01:24' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/761/114/33/76111433_s01_lt.jpg' } }, 'uuid': 'eeefccec-c9d4-4bce-8c5b-b32b32346248', 'hasDownloadableComp': true }, { 'assetId': 7829117, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'A neon sign advertises the Trump hotel and casino in Atlantic City, New Jersey.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:00:05' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/210/7/3452107_30707_lt.jpg' } }, 'uuid': '56a966c2-0293-4c73-b5b8-1b1dd6cbd753', 'hasDownloadableComp': true }], 'pagination': { 'totalCount': 18, 'currentPage': 1, 'pageSize': 100, 'hasNextPage': false, 'hasPreviousPage': false, 'numberOfPages': 1 } }, 'tags': ['ever', 'best', 'state', 'wow'], 'assetsCount': 18 }, 'asset': { 'assetId': 30886895, 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Traffic curves around a freeway near Weehawken, New Jersey and toward the Lincoln Tunnel and New York City.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '00:01:55' }], 'name': '', 'thumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/345/341/3/3453413_169078_lt.jpg' } }, 'uuid': '86c2ac8f-a03f-42ee-8379-0941e332e202', 'hasDownloadableComp': true } };
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
