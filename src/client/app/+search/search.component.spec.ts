import {
  beforeEachProvidersArray,
  Observable,
  inject,
  TestBed
} from '../imports/test.imports';

import { SearchComponent } from './search.component';
import { UiConfig } from '../shared/services/ui.config';
import { AssetData } from './services/asset.data.service';
import { FilterService } from '../shared/services/filter.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { SearchContext } from '../shared/services/search-context.service';

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

    class MockSortDefinitionsService {
      public getSortDefinitions() {
        return Observable.of(mockSortDefinitions());
      }

      public update(params: any) {
        return true;
      }
    }

    class MockSearchContext {
      public update() {
        return true;
      }

      public go() {
        return true;
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        SearchComponent,
        SearchContext,
        FilterService,
        { provide: AssetData, useClass: MockAssetData },
        { provide: UiConfig, useClass: MockUiConfig },
        { provide: SortDefinitionsService, useClass: MockSortDefinitionsService },
        { provide: SearchContext, useClass: MockSearchContext }
      ]
    }));


    it('Should have a onSortResults() event handler function that updates the currentSort and searchContext',
      inject([SearchComponent], (component: SearchComponent) => {
        component.sortOptions = mockSortDefinitions().list;
        spyOn(component.userPreferences, 'updateSortPreference');
        spyOn(component.sortDefinition, 'update');
        spyOn(component.searchContext, 'update');
        spyOn(component.searchContext, 'go');
        component.onSortResults(mockSortDefinitions().list[1].first);
        expect(component.userPreferences.updateSortPreference).toHaveBeenCalledWith(4);
        expect(component.sortDefinition.update).toHaveBeenCalledWith({ currentSort: mockSortDefinitions().list[1].first});
        expect(component.searchContext.update).toEqual({ 'i': 1, 'sortId': 4 });
        expect(component.searchContext.go).toHaveBeenCalled();
      }));

  });

  function MockSearchResultsResponse() {
    return { 'items': [{ 'assetId': 28068744, 'name': '80805947_032', 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '9600' }], 'thumbnail': { 'name': '80805947_032_lt.jpg', 'urls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D' } }, 'renditions': [{ 'id': 28098478, 'name': '80805947_032_st.jpg', 'format': 'Image', 'purpose': 'Thumbnail', 'size': 'Small', 'url': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'internalUrls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D' }, 'internalUri': 't3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg' }] }], 'totalCount': 76, 'currentPage': 1, 'pageSize': 25, 'hasNextPage': true, 'hasPreviousPage': true, 'numberOfPages': 4 };
  }

  function MockConfigResponse() {
    return { search: {} };
  }

  function mockSortDefinitions() {
    return {
      'list': [
        {
          'first': {'lastUpdated': '2016-09-21T15:06:40Z','createdOn': '2016-08-18T18:01:44Z','id': 2,'siteName': 'core','name': 'Relevance (most relevant first)','isDefault': false,'pairId': 'testPair','association': 'user:1','sorts': [{'field': 'score','descending': true}]}
        },
        {
          'first': {'lastUpdated': '2016-09-21T14:50:51Z','createdOn': '2016-09-16T20:13:22Z','id': 4,'siteName': 'core','name': 'Date Added (oldest first)','isDefault': false,'pairId': 'date','association': 'user:25','sorts': [{'field': 'ingested','descending': false}]},
          'second': {'lastUpdated': '2016-09-21T14:51:18Z','createdOn': '2016-09-16T20:23:26Z','id': 5,'siteName': 'core','name': 'Date Added (newest first)','isDefault': false,'pairId': 'date','association': 'user:25','sorts': [{'field': 'ingested','descending': true}]}
        }
      ]
    };
  }
}
