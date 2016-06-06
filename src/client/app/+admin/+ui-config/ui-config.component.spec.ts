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
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Admin UI Config Component', () => {
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
      provide(RouteSegment, { useValue: new RouteSegment([], { site: 'core' }, null, null, null) }),
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
      }));

    it('Should have a goToSite method that given a siteName navigates to the ui-config page for that site',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        spyOn(component.router, 'navigate');
        component.goToSite('bbcws');
        expect(component.router.navigate).toHaveBeenCalledWith(['admin/ui-config/', 'bbcws']);
      }));

    it('Should have a show() method that sets subComponents',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.components = mockResponse().components;
        component.show('header');
        expect(component.subComponents).toEqual(mockResponse().components['header'].config);
      }));

    it('Should have a buildForm() method that sets form',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.subComponents = mockResponse().components['header'].config;
        component.buildForm('title');
        expect(component.form).toEqual({value: 'Wazee Digital'});
      }));

    it('Should have a showSubItems() method that sets configOptions',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.subComponents = mockResponse().components['adminAccount'].config;
        component.showSubItems('tableHeaders');
        expect(component.configOptions).toEqual(mockResponse().components['adminAccount'].config['tableHeaders'].items);
      }));

    it('Should have a buildSubItemForm() method that sets form',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.configOptions = mockResponse().components['adminAccount'].config['tableHeaders'].items;
        component.buildSubItemForm(1);
        expect(component.form).toEqual(mockResponse().components['adminAccount'].config['tableHeaders'].items[1]);
      }));
  });

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
    return config;
  }
}
