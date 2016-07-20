import {
  beforeEachProvidersArray,
  beforeEachProviders,
  ResponseOptions,
  RequestOptions,
  MockBackend,
  beforeEach,
  Response,
  describe,
  Headers,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { AssetData } from './asset.data.service';

export function main() {
  describe('Asset data service', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls',
      inject([AssetData], (service: AssetData) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.currentUser).toBeDefined();
      }));

    it('Should return correct api URL for a logged out user', inject([AssetData], (service: AssetData) => {
      let loggedIn = false;
      expect(service.searchAssetsUrl(loggedIn)).toEqual(
        service.apiConfig.baseUrl() + service.getAssetSearchPath(loggedIn)
      );
    }));

    it('Should return correct api URL for a logged in user', inject([AssetData], (service: AssetData) => {
      let loggedIn = true;
      expect(service.searchAssetsUrl(loggedIn)).toEqual(
        service.apiConfig.baseUrl() + service.getAssetSearchPath(loggedIn)
      );
    }));

    it('Should return correct api URL path for a logged out user', inject([AssetData], (service: AssetData) => {
      let loggedIn = false;
      expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/search/anonymous');
    }));

    it('Should return correct api URL path for a logged in user', inject([AssetData], (service: AssetData) => {
      let loggedIn = true;
      expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/search');
    }));


    it('Should return correct URL params for a search with logged out user', inject([AssetData], (service: AssetData) => {
      let loggedIn = false;
      let sOptions = service.getAssetSearchOptions(searchParams(), loggedIn);
      expect(sOptions instanceof RequestOptions).toBeTruthy();
      expect(sOptions.search.has('siteName')).toBeTruthy();
      expect(sOptions.search.get('siteName')).toEqual(service.apiConfig.getPortal());
    }));

    it('Should return correct URL params for a search with logged in user', inject([AssetData], (service: AssetData) => {
      let loggedIn = true;
      let sOptions = service.getAssetSearchOptions(searchParams(), loggedIn);
      expect(sOptions instanceof RequestOptions).toBeTruthy();
      expect(sOptions.headers instanceof Headers).toBeTruthy();
      expect(sOptions.search.get('q')).toEqual('green');
      expect(sOptions.search.get('n')).toEqual('25');
      expect(!sOptions.search.has('siteName')).toBeTruthy();
    }));

    it('Should make a request to the search api with the correct url and params and return the correct payload to cache in the store',
      inject([AssetData, MockBackend], (service: AssetData, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.searchAssets(searchParams()).subscribe((payload) => {
          expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/assets/v1/search/anonymous?q=green&n=25&i=0&siteName=core');
          expect(payload).toEqual(MockSearchResultsResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: MockSearchResultsResponse()
          })
        ));
      }));
  });

  function searchParams() {
    return {
      'q': 'green',
      'n': '25',
      'i': '1'
    };
  }

  function MockSearchResultsResponse() {
    return { 'items': [{ 'assetId': 28068744, 'name': '80805947_032', 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '9600' }], 'thumbnail': { 'name': '80805947_032_lt.jpg', 'urls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D' } }, 'renditions': [{ 'id': 28098478, 'name': '80805947_032_st.jpg', 'format': 'Image', 'purpose': 'Thumbnail', 'size': 'Small', 'url': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'internalUrls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D' }, 'internalUri': 't3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg' }] }], 'totalCount': 76, 'currentPage': 1, 'pageSize': 25, 'hasNextPage': true, 'hasPreviousPage': true, 'numberOfPages': 4 };
  }
}
