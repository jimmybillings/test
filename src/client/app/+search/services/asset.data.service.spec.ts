import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../../imports/test.imports';

import { AssetData } from './asset.data.service';
import { AssetStore } from './asset.store';

export function main() {
  describe('Asset data service', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        AssetStore
      ]
    }));

    it('Should make a request to the search api with the correct url and params ' +
      'and return the correct payload to cache in the store -- LOGGED OUT',
      inject([AssetData, MockBackend], (service: AssetData, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.searchAssets(searchParams()).subscribe((payload) => {
          expect(connection.request.url.split('.com')[1]).toBe(
            '/api/assets/v1/search/anonymous?q=green&n=25&i=0&viewType=grid&siteName=core');
          expect(payload).toEqual(MockSearchResultsResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: MockSearchResultsResponse()
          })
        ));
      }));

    it('Should make a request to the search api with the correct url and params and' +
      'return the correct payload to cache in the store -- LOGGED IN',
      inject([AssetData, MockBackend], (service: AssetData, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.currentUser.set(setLoggedInUser(), 'SOME_TOKEN');
        service.searchAssets(searchParams()).subscribe((payload) => {
          expect(connection.request.url.split('.com')[1]).toBe(
            '/api/assets/v1/search?q=green&n=25&i=0&viewType=grid');
          expect(payload).toEqual(MockSearchResultsResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: MockSearchResultsResponse()
          })
        ));
      }));
  });

  function setLoggedInUser() {
    return {
      'lastUpdated': '2016-01-14T16:46:21Z',
      'createdOn': '2016-01-14T16:46:21Z',
      'id': 6,
      'emailAddress': 'test_email@email.com',
      'password': '5daf7de08c0014ec2baa13a64b35a4e0',
      'firstName': 'first',
      'lastName': 'last',
      'siteName': 'cnn',
      'accountIds': [4],
      'permissions': [
        'Root'
      ]
    };
  }

  function searchParams() {
    return {
      'q': 'green',
      'n': '25',
      'i': '1'
    };
  }

  function MockSearchResultsResponse() {
    return {
      'items': [
        {
          'assetId': 28068744,
          'name': '80805947_032',
          'metaData': [
            {
              'name': 'Title',
              'value': ''
            },
            {
              'name': 'Description',
              'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.'
            },
            {
              'name': 'TE.DigitalFormat',
              'value': 'High Definition'
            },
            {
              'name': 'Format.Duration',
              'value': '9600'
            }
          ],
          'thumbnail':
          {
            'name': '80805947_032_lt.jpg',
            'urls': {
              'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg',
              'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg',
              'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg',
              'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg',
              'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg',
              'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg'
            }
          },
          'renditions': [
            {
              'id': 28098478,
              'name': '80805947_032_st.jpg',
              'format': 'Image',
              'purpose': 'Thumbnail',
              'size': 'Small',
              'url': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg',
              'internalUrls': {
                'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg',
                'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg',
                'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg',
                'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg',
                'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg',
                'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg'
              },
              'internalUri': 't3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m'
            }]
        }],
      'totalCount': 76,
      'currentPage': 1,
      'pageSize': 25,
      'hasNextPage': true,
      'hasPreviousPage': true,
      'numberOfPages': 4
    };
  }
}
