import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { provide, PLATFORM_PIPES} from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { AssetDataComponent} from './asset-data.component';
import { TranslatePipe, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
// import { createOverlayContainer } from '@angular2-material/core/overlay/overlay-container';
// import { OVERLAY_CONTAINER_TOKEN } from '@angular2-material/core/overlay/overlay';

export function main() {
  describe('Asset Data Component', () => {
    class MockRouter { }
    beforeEachProviders(() => [
      AssetDataComponent,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      { provide: Router, useClass: MockRouter },
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true})
    ]);

    it('Create instance of AssetDataComponent',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetDataComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetDataComponent).toBeTruthy();
        });
      }));
  });
}
