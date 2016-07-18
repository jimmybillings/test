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
import { CollectionsService} from './+collection/services/collections.service';
import { ActiveCollectionService } from './+collection/services/active-collection.service';
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
      ActiveCollectionService,
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
  });
}
