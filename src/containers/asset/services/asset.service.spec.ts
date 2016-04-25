import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AssetService, asset } from './asset.service';
import { ApiConfig } from '../../../common/config/api.config';
import { CurrentUser } from '../../../common/models/current-user.model';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http, ResponseOptions, Response } from 'angular2/http';
import { provideStore } from '@ngrx/store/dist/index';
import { Error } from '../../../common/services/error.service';

export function main() {
  describe('Asset service', () => {
    
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({asset}),
      AssetService,
      ApiConfig,
      CurrentUser,
      Error
    ]);

    it('Should setup instance variables for the api endpoint and the asset store',
      inject([AssetService], (service) => {
        expect(service._apiUrl).toEqual('https://crxextapi.dev.wzplatform.com/api/assets/v1/clip/');
        service.asset.subscribe((asset) => {
          expect(asset).toEqual({ clipData: [  ] });
        });
      }));
      
    it('Should call the api endpoint for Asset and return a correctly formatted payload to cache in the Asset Store', 
      inject([AssetService, MockBackend], (service, mockBackend) => {
        let connection;
        connection = mockBackend.connections.subscribe(c => connection = c);
        service.initialize(1).subscribe(payload => {
          expect(connection.request.url).toBe(service._apiUrl + '1');
          expect(payload).toEqual( { type: 'SET_ASSET', payload: MockAssetResponse()});
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: MockAssetResponse()
          })
        ));
    }));
    
    it('Should expect a correctly formatted payload it add it to the Asset Store', inject([AssetService], (service) => {
      spyOn(service.store, 'dispatch');
      service.set({ type: 'SET_ASSET', payload: MockAssetResponse()});
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'SET_ASSET', payload: MockAssetResponse()});
    }));
    
    it('Should expect a correctly formatted payload it add it to the Asset Store', inject([AssetService], (service) => {
      spyOn(service.store, 'dispatch');
      service.reset();
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'RESET' });
    }));

  });
  
  function MockAssetResponse() {
    return {'items':[{'assetId':28068744,'name':'80805947_032','metaData':[{'name':'Title','value':''},{'name':'Description','value':'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.'},{'name':'TE.DigitalFormat','value':'High Definition'},{'name':'Format.Duration','value':'9600'}],'thumbnail':{'name':'80805947_032_lt.jpg','urls':{'http-download':'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D','http':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','http-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg','https-download':'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D'}},'renditions':[{'id':28098478,'name':'80805947_032_st.jpg','format':'Image','purpose':'Thumbnail','size':'Small','url':'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','internalUrls':{'http-download':'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D','http':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','http-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https-browser':'//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg','https-download':'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D'},'internalUri':'t3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg'}]}]};
  }
}
