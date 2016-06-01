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
import { provide, Injectable } from '@angular/core';
import { RouteSegment } from '@angular/router';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig , config } from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Admin UI Config component', () => {
    @Injectable()
    class MockConfigService {
      public getUiConfig(siteName: string) {
        return Observable.of(mockResponse());
      }
    }

    beforeEachProviders(() => [
      UiConfigComponent,
      provide(ConfigService, { useClass: MockConfigService }),
      ROUTER_FAKE_PROVIDERS,
      MockBackend,
      ApiConfig,
      UiConfig,
      BaseRequestOptions,
      provide(RouteSegment, { useValue: new RouteSegment([], { 'site': 'core' }, null, null, null) }),
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

    it('Should have a getConfig method that hits the service and stores data in variables',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.siteName = 'core';
        component.getConfig();
        expect(component.config).toEqual(mockResponse());
        expect(component.items).toEqual(['header', 'searchBox']);
      }));
  });

  function mockResponse() {
    return {
            'siteName': 'core',
            'id': '1',
            'components': {
              'header': {
                'config': {
                  'title': {
                    'value': 'Wazee Digital'
                  }
                }
              },
              'searchBox': {
                'config': {
                  'pageSize': {
                    'value': '100'
                  }
                }
              }
            }
          };
  }
}
