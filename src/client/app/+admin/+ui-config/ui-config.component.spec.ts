import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { UiConfigComponent } from './ui-config.component';
import { ConfigService } from '../services/config.service';
import { provide } from '@angular/core';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig , config } from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Admin UI Config component', () => {
    beforeEachProviders(() => [
      UiConfigComponent,
      ConfigService,
      ROUTER_FAKE_PROVIDERS,
      MockBackend,
      ApiConfig,
      UiConfig,
      BaseRequestOptions,
      provideStore({ config: config }),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      })
    ]);

    it('Create an instance of Ui Config',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(UiConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof UiConfigComponent).toBeTruthy();
        });
      }));
  });
}
