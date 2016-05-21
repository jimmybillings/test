import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { AssetComponent} from './asset.component';
import { provide, Injectable} from '@angular/core';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../shared/services/api.config';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig, config} from '../shared/services/ui.config';
import { Error } from '../shared/services/error.service';
import { provideStore } from '@ngrx/store';
import { AssetService, asset} from './services/asset.service';
import { Observable} from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import {RouteSegment, Router} from '@angular/router';

export function main() {
  describe('Asset Component', () => {
    @Injectable()
    class MockAssetService {
      public asset: Observable<any>;
      constructor(public store: Store<any>) {
        this.asset = this.store.select('asset');
      }
      initialize(name: any) {
        return Observable.of(MockAssetResponse());
      }
      set(asset: any) {
        return true;
      }
      reset() {
        return true;
      }
    }

    beforeEachProviders(() => [
      AssetComponent,
      ROUTER_FAKE_PROVIDERS,
      provide(RouteSegment, {useFactory: (r: any) => r.routeTree.root, deps: [Router]}),
      provide(AssetService, { useClass: MockAssetService }),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({ config, asset }),
      CurrentUser,
      UiConfig,
      ApiConfig,
      Error
    ]);

    it('Create instance of asset component',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetComponent).toBeTruthy();
        });
      }));

    it('Should call the server to get clip data information', inject([AssetComponent], (service: AssetComponent) => {
      spyOn(service.assetService, 'set');
      service.ngOnInit();
      expect(service.assetService.set).toHaveBeenCalledWith(MockAssetResponse());
    }));

    it('Should reset the asset store when the component is destroyed', inject([AssetComponent], (service: AssetComponent) => {
      spyOn(service.assetService, 'reset');
      service.ngOnDestroy();
      expect(service.assetService.reset).toHaveBeenCalled();
    }));

  });

  function MockAssetResponse() {
    return { 'items': [{ 'assetId': 28068744, 'name': '80805947_032', 'metaData': [{ 'name': 'Title', 'value': '' }, { 'name': 'Description', 'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.' }, { 'name': 'TE.DigitalFormat', 'value': 'High Definition' }, { 'name': 'Format.Duration', 'value': '9600' }], 'thumbnail': { 'name': '80805947_032_lt.jpg', 'urls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_lt.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=rLzXU%2BAF8SzmGsQNV3yCUw8K2gc%3D' } }, 'renditions': [{ 'id': 28098478, 'name': '80805947_032_st.jpg', 'format': 'Image', 'purpose': 'Thumbnail', 'size': 'Small', 'url': 'http://cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'internalUrls': { 'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D', 'http': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'http-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-browser': '//cdnt3m-a.akamaihd.net/tem/warehouse/808/059/47/80805947_032_st.jpg', 'https-download': 'https://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg?Expires=1456627681&response-content-disposition=attachment&AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Signature=nVfVOqcH66oZsa2OwevnifPrhAs%3D' }, 'internalUri': 't3://S3ViaAkamai:f3427bd4-e75c-4e4d-9c16-7e4bb2ef8bf8@s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_st.jpg' }] }] };
  }
}
