import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide, PLATFORM_PIPES} from '@angular/core';
import { Router } from '@angular/router';
import { WzAssetListComponent} from './wz.asset-list.component';
import { createOverlayContainer } from '@angular2-material/core/overlay/overlay-container';
import { OVERLAY_CONTAINER_TOKEN } from '@angular2-material/core/overlay/overlay';
import { TranslateLoader, TranslateStaticLoader, TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Asset List Component', () => {
    class MockRouter { }
    beforeEachProviders(() => [
      WzAssetListComponent,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      { provide: Router, useClass: MockRouter },
      provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true})
    ]);

    it('Create instance of AssetList',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzAssetListComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzAssetListComponent).toBeTruthy();
        });
      }));

    it('Should return a shortened version for High Definition, Standard Definition etc...', inject([WzAssetListComponent], (service: WzAssetListComponent) => {
      expect(service.formatType('High Definition')).toEqual('hd');
      expect(service.formatType('Standard Definition')).toEqual('sd');
      expect(service.formatType('Digital Video')).toEqual('dv');
      expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
    }));

    it('Should fire an event to show an asset when clicked', inject([WzAssetListComponent], (service: WzAssetListComponent) => {
      spyOn(service.onShowAsset, 'emit');
      service.showAsset('12345');
      expect(service.onShowAsset.emit).toHaveBeenCalledWith('12345');
    }));
  });
}
