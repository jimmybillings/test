import {
  describe,
  expect,
  inject,
  TestComponentBuilder,
  it,
  beforeEachProviders
} from 'angular2/testing';

import {AppComponent} from './app.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser} from './common/models/current-user.model';
import {ApiConfig} from './common/config/api.config';
import {UiConfig, config} from './common/config/ui.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { provideStore } from '@ngrx/store/dist/index';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Authentication} from './containers/user-management/services/authentication.data.service';
import {MultilingualService, multilingualReducer} from './common/services/multilingual.service';
import {SearchContext} from './common/services/search-context.service';


export function main() {
  
  describe('App Component', () => {
    
    beforeEachProviders(() => [
      AppComponent,
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(Router, {useClass: RootRouter}),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
      }),
      MultilingualService,
      provideStore({config: config, i18n: multilingualReducer}),
      CurrentUser,
      TranslateService,
      ApiConfig,
      Authentication,
      UiConfig,
      SearchContext
    ]);
    
    it('Create instance of app and assign the CurrentUser to an instance variable inside of app', 
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AppComponent).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
          expect(instance instanceof AppComponent).toBeTruthy();
        });
    }));
    
    
    it('Should initialize the header position to be absolulte positioned by setting \'showFixed\' to be false',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AppComponent).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.showFixed).toEqual(false);
        });
      }));

    it('Should set the header to absolute by setting \'showFixed\' to be false if the page scrolls less than 111px\'s',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AppComponent).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          instance.showFixedHeader(114);
          expect(instance.showFixed).toEqual(true);
        });
      }));

    it('Should set the header to fixed by setting \'showFixed\' to be true if the page scrolls down more than 111px\'s',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AppComponent).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          instance.showFixedHeader(108);
          expect(instance.showFixed).toEqual(false);
        });
      }));
    
    it('Should log out a user', inject([AppComponent], (component) => {
      spyOn(component._authentication, 'destroy').and.callThrough();
      spyOn(component._currentUser, 'destroy');
      spyOn(component.router, 'navigate');
      component.logout();
      expect(component._authentication.destroy).toHaveBeenCalled();
      expect(component._currentUser.destroy).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith(['/Home']);
    }));
    
    it('Should change the current language', inject([AppComponent], (component) => {
      spyOn(component.multiLingual, 'setLanguage');
      component.changeLang({lang: 'fr'});
      expect(component.multiLingual.setLanguage).toHaveBeenCalledWith('fr');
    }));
        
    it('Should hide the search bar on certain routes', inject([AppComponent], (component) => {
      ['UserManagement', 'Home', 'Admin'].forEach((item) => {
        expect(component.checkRouteForSearchBar(item)).toEqual(false);
      });
    }));
    
    it('Should show the search bar on other routes', inject([AppComponent], (component) => {
      ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
        expect(component.checkRouteForSearchBar(item)).toEqual(true);
      });
    }));
    
    
    
    
  });
}
