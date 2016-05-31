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
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig , config } from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Admin Config component', () => {
    beforeEachProviders(() => [
      ConfigComponent,
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

    it('Create instance of config',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ConfigComponent).toBeTruthy();
        });
      }));

      it('Should have a navigateToShowUi method that console.logs for now', inject([ConfigComponent], (component: ConfigComponent) => {
        spyOn(console, 'log');
        component.navigateToShowUi({siteName: 'core'});
        expect(console.log).toHaveBeenCalledWith('navigate to ui', {siteName: 'core'});
      }));

      it('Should have a navigateToShowSite method that console.logs for now', inject([ConfigComponent], (component: ConfigComponent) => {
        spyOn(console, 'log');
        component.navigateToShowSite({siteName: 'core'});
        expect(console.log).toHaveBeenCalledWith('navigate to site', {siteName: 'core'});
      }));
  });
}
