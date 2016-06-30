import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ConfigComponent } from './config.component';
import { ConfigService } from '../services/config.service';
import { provide } from '@angular/core';
import { Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig , config } from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

export function main() {
  describe('Admin Config component', () => {
    class MockRouter{}
    beforeEachProviders(() => [
      ConfigComponent,
      ConfigService,
      { provide: Router, useClass: MockRouter },
      MockBackend,
      ApiConfig,
      UiConfig,
      BaseRequestOptions,
      provideStore({ config: config }),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      TranslateService
    ]);

    it('Create instance of config',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ConfigComponent).toBeTruthy();
        });
      }));
  });
}
