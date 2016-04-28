import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders,
inject
} from 'angular2/testing';

import {Home} from './home.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig, config} from '../../common/config/ui.config';
import { provideStore } from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

export function main() {
  describe('Home Component', () => {
    
    class MockUiConfig {
      get(comp) {
        return Observable.of({'components': {'component': 'true'}, 'config': {'config': 'true'}});
      }
    }
    
    beforeEachProviders(() => [
      Home,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Home }),
      provide(Router, { useClass: RootRouter }),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({config: config}),
      CurrentUser,
      provide(UiConfig, {useClass: MockUiConfig}),
      ApiConfig
    ]);

    it('Create instance of home and assign the CurrentUser to an instance variable inside of home',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Home).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Home).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
    
    it('Should call the config service for the home component config options', inject([Home], (component) => {
      spyOn(component.uiConfig, 'get').and.callThrough();
      component.ngOnInit();
      expect(component.uiConfig.get).toHaveBeenCalledWith('home');
      expect(component.components).toEqual({'component': 'true'});
      expect(component.config).toEqual({'config': 'true'});
    }));

  });
}
