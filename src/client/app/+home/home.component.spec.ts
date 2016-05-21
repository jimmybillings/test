import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {HomeComponent} from './home.component';
import {provide} from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../shared/services/api.config';
import {CurrentUser} from '../shared/services/current-user.model';
import {UiConfig, config} from '../shared/services/ui.config';
import { provideStore } from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {SearchContext} from '../shared/services/search-context.service';

export function main() {
  describe('Home Component', () => {

    class MockUiConfig {
      get(comp: any) {
        return Observable.of({ 'components': { 'component': 'true' }, 'config': { 'config': 'true' } });
      }
    }

    beforeEachProviders(() => [
      HomeComponent,
      ROUTER_FAKE_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({ config: config }),
      CurrentUser,
      provide(UiConfig, { useClass: MockUiConfig }),
      ApiConfig,
      SearchContext
    ]);

    it('Create instance of home and assign the CurrentUser to an instance variable inside of home',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(HomeComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof HomeComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));

    it('Should call the config service for the home component config options', inject([HomeComponent], (component: HomeComponent) => {
      spyOn(component.uiConfig, 'get').and.callThrough();
      component.ngOnInit();
      expect(component.uiConfig.get).toHaveBeenCalledWith('home');
      expect(component.config).toEqual({ 'config': 'true' });
    }));

  });
}
