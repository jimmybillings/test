import {
  beforeEachProvidersArray,
  Observable,
  // inject,
  TestBed
} from '../imports/test.imports';

import { SearchComponent } from './search.component';
import { UiConfig } from '../shared/services/ui.config';
import { AssetData } from './services/asset.data.service';

export function main() {
  describe('Search Component', () => {
    class MockUiConfig {
      public get(component: any) {
        return Observable.of(MockConfigResponse());
      }
    }

    class MockAssetData {
      public searchAssets() {
        return Observable.of(MockSearchResultsResponse());
      }

      public storeAssets(payload: any) {
        return payload;
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        SearchComponent,
        { provide: AssetData, useClass: MockAssetData },
        { provide: UiConfig, useClass: MockUiConfig }
      ]
    }));

  });

  function MockSearchResultsResponse() {
    return { 'items': [{ 'assetId': 28068744, 'name': '80805947_032', 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '9600' }], 'thumbnail': { 'name': '80805947_032_lt.jpg', 'urls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D' } }, 'renditions': [{ 'id': 28098478, 'name': '80805947_032_st.jpg', 'format': 'Image', 'purpose': 'Thumbnail', 'size': 'Small', 'url': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'internalUrls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D' }, 'internalUri': 't3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg' }] }], 'totalCount': 76, 'currentPage': 1, 'pageSize': 25, 'hasNextPage': true, 'hasPreviousPage': true, 'numberOfPages': 4 };
  }

  function MockConfigResponse() {
    return { search: {} };
  }
}
