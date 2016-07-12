import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { provide, Renderer, PLATFORM_PIPES} from '@angular/core';
import { Router, RouterOutletMap, ActivatedRoute } from '@angular/router';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideStore } from '@ngrx/store';
import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzNotificationService } from './shared/components/wz-notification/wz.notification.service';
import { AppComponent} from './app.component';
import { CurrentUser} from './shared/services/current-user.model';
import { ApiConfig} from './shared/services/api.config';
import { UiState, uiState } from './shared/services/ui.state';
import { UiConfig, config} from './shared/services/ui.config';
import { Authentication} from './+user-management/services/authentication.data.service';
import { MultilingualService, multilingualReducer} from './shared/services/multilingual.service';
import { SearchContext} from './shared/services/search-context.service';
import { CollectionsService} from './+collections/services/collections.service';
import { ViewContainerService } from './shared/services/view-container.service';
import { UserPermission } from './shared/services/permission.service';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    class MockRouter {
      navigate(params: any) {
        return params;
      }
    }
    class MockActivatedRoute { }
    beforeEachProviders(() => [
      AppComponent,
      RouterOutletMap,
      { provide: Router, useClass: MockRouter },
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
      MockBackend,
      ViewContainerService,
      BaseRequestOptions,
      Renderer,
      UserPermission,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      TranslateService,
      MultilingualService,
      provideStore({ config: config, i18n: multilingualReducer, uiState }),
      CurrentUser,
      ApiConfig,
      Authentication,
      UiConfig,
      SearchContext,
      CollectionsService,
      UiState,
      WzNotificationService
    ]);

    it('Create instance of app and assign the CurrentUser to an instance variable inside of app',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AppComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
          expect(instance instanceof AppComponent).toBeTruthy();
        });
      }));


    // it('Should initialize the header position to be absolulte positioned by setting \'showFixed\' to be false',
    //   inject([TestComponentBuilder], (tcb: any) => {
    //     tcb.createAsync(AppComponent).then((fixture: any) => {
    //       let instance = fixture.debugElement.componentInstance;
    //       expect(instance.showFixed).toEqual(false);
    //     });
    //   }));

    // it('Should set the header to absolute by setting \'showFixed\' to be false if the page scrolls less than 111px\'s',
    //   inject([TestComponentBuilder], (tcb: any) => {
    //     tcb.createAsync(AppComponent).then((fixture: any) => {
    //       let instance = fixture.debugElement.componentInstance;
    //       instance.showFixedHeader(114);
    //       expect(instance.showFixed).toEqual(true);
    //     });
    //   }));

    // it('Should set the header to fixed by setting \'showFixed\' to be true if the page scrolls down more than 111px\'s',
    //   inject([TestComponentBuilder], (tcb: any) => {
    //     tcb.createAsync(AppComponent).then((fixture: any) => {
    //       let instance = fixture.debugElement.componentInstance;
    //       instance.showFixedHeader(108);
    //       expect(instance.showFixed).toEqual(false);
    //     });
    //   }));

    it('Should log out a user', inject([AppComponent], (component: any) => {
      spyOn(component.authentication, 'destroy').and.callThrough();
      spyOn(component.currentUser, 'destroy');
      spyOn(component.collectionsService, 'destroyCollections');
      component.logout();
      expect(component.authentication.destroy).toHaveBeenCalled();
      expect(component.currentUser.destroy).toHaveBeenCalled();
      expect(component.collectionsService.destroyCollections).toHaveBeenCalled();
    }));

    it('Should change the current language', inject([AppComponent], (component: any) => {
      spyOn(component.multiLingual, 'setLanguage');
      component.changeLang({ lang: 'fr' });
      expect(component.multiLingual.setLanguage).toHaveBeenCalledWith({ lang: 'fr' });
    }));

    // it('Should hide the search bar on certain routes', inject([AppComponent], (component: any) => {
    //   ['user', '', 'admin'].forEach((item) => {
    //     expect(component.checkRouteForSearchBar(item)).toEqual(false);
    //   });
    // }));

    // it('Should show the search bar on other routes', inject([AppComponent], (component: any) => {
    //   ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
    //     expect(component.checkRouteForSearchBar(item)).toEqual(true);
    //   });
    // }));




  });
}
