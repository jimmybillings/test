import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {provide, PLATFORM_PIPES} from '@angular/core';
import {MockBackend} from '@angular/http/testing';
import {ApiConfig} from '../../shared/services/api.config';
import {NewComponent} from './new.component';
import {UiConfig, config} from '../../shared/services/ui.config';
import {provideStore} from '@ngrx/store';
import {Router, ActivatedRoute} from '@angular/router';
import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
export function main() {
  describe('Admin New component', () => {

    class MockRouter {
      navigate(params: any) {
        return params;
      }
    }

    class MockActivatedRoute { }
    beforeEachProviders(() => [
      { provide: Router, useClass: MockRouter },
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
      MockBackend,
      BaseRequestOptions,
      TranslateService,
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ApiConfig,
      provideStore({ config: config }),
      UiConfig,
      AdminService,
      NewComponent,
    ]);

    it('Should Create instance of New',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(NewComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof NewComponent).toBeTruthy();
        });
      }));
  });
}
