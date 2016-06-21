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
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

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

    it('Should have a getConfigs method that retrieves all of the ui and site config objects',
      inject([ConfigComponent], (component: ConfigComponent) => {
        spyOn(component.configService, 'getUi').and.returnValue(Observable.of(mockResponse()));
        spyOn(component.configService, 'getSite').and.returnValue(Observable.of(mockResponse()));
        component.getConfigs();
        let expectedUi = Object.assign(mockResponse().items[0], {lastUpdateBy: 'Ross Edfort', type: 'ui'});
        let expectedSite = Object.assign(mockResponse().items[0], {lastUpdateBy: 'Ross Edfort', type: 'site'});
        expect(component.uiConfigs).toEqual([expectedUi]);
        expect(component.siteConfigs).toEqual([expectedSite]);
      }));

    function mockResponse() {
      let config: IuiConfig = {
        'lastUpdated': '2016-06-06T16:44:59Z',
        'createdOn': '2016-03-02T17:01:14Z',
        'id': 1,
        'siteName': 'core',
        'config': {},
        'components': {
          'header': {'config': {'title': {'value': 'Wazee Digital'}}},
          'searchBox': {'config': {'pageSize': {'value': '100'}}},
          'search': {'config': {'viewType': {'value': 'grid'}}},
          'home': {'config': {'pageSize': {'value': '100'}}},
          'adminAccount': {'config': {
            'tableHeaders': {'items': [
              {'name': 'name','label': 'ADMIN.ACCOUNT.NAME_LABEL'},
              {'name': 'status','label': 'ADMIN.ACCOUNT.STATUS_LABEL'},
              {'name': 'contact','label': 'ADMIN.ACCOUNT.CONTACT_LABEL'},
              {'name': 'createdOn','label': 'ADMIN.ACCOUNT.CREATED_ON_LABEL'}]}
            }
          }
        }
      };
      return {'items': [config]};
    }
  });
}
