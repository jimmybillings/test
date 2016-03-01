import {
TestComponentBuilder,
describe,
expect,
injectAsync,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {Search} from './search.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, RouteParams, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter, } from 'angular2/src/router/router';
import { MockBackend } from 'angular2/http/testing';
import {HTTP_PROVIDERS} from 'angular2/http';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig} from '../../common/config/ui.config';
import {AssetData} from '../../common/services/asset.data.service';
import {Observable} from 'rxjs/Rx';

export function main() {
  describe('Search Component', () => {
    
    
    class MockUiConfig {
      public get(component) {
        return {search:{}};
      }
    }
    class MockAssetData {
      public searchAssets() {
        return Observable.of(MockSearchResultsResponse());
      }
    }
    beforeEachProviders(() => [
      Search,
      RouteRegistry,
      provide(RouteParams, { useValue: new RouteParams({ q: 'blue' }) }),
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Search }),
      provide(Router, { useClass: RootRouter }),
      HTTP_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      CurrentUser,
      ApiConfig,
      provide(AssetData, {useClass: MockAssetData}),
      provide(UiConfig, {useClass: MockUiConfig}),
    ]);

    it('Should have a search instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Search).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Search).toBeTruthy();
        });
      })
    );
    
    it('Should call the search method on component instantiation', inject([Search], (search) => {
      spyOn(search, 'searchAssets');
      search.ngOnInit();
      expect(search.searchAssets).toHaveBeenCalled();
    }));
    
    it('Should complete a search and assign response to search.results', 
      inject([Search], (search) => {
        search.routeParams.params = {q: 'Obama', n: '25'};
        search.searchAssets();
        expect(search.results).toEqual(MockSearchResultsResponse());
    }));

  });
  
  function MockSearchResultsResponse() {
    return {'items':[{'assetId':28068744,'name':'80805947_032','metaData':[{'name':'Title','value':''},{'name':'Description','value':'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.'},{'name':'TE.DigitalFormat','value':'High Definition'},{'name':'Format.Duration','value':'9600'}],'thumbnail':{'name':'80805947_032_lt.jpg','urls':{'http-download':'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D','http':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','http-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https-download':'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D'}},'renditions':[{'id':28098478,'name':'80805947_032_st.jpg','format':'Image','purpose':'Thumbnail','size':'Small','url':'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','internalUrls':{'http-download':'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D','http':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','http-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https-download':'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D'},'internalUri':'t3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg'}]}],'totalCount':76,'currentPage':1,'pageSize':25,'hasNextPage':true,'hasPreviousPage':true,'numberOfPages':4};
  }
}
