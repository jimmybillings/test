import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { CollectionComponent } from './collection.component';
import { CollectionsService, collections, focusedCollection } from './services/collections.service';
import { CurrentUser, currentUser} from '../shared/services/current-user.model';
import { ApiConfig } from '../shared/services/api.config';
import { UiConfig } from '../shared/services/ui.config';
import { UiState, uiState } from '../shared/services/ui.state';
import { provide } from '@angular/core';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Error } from '../shared/services/error.service';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

export function main() {
  describe('Collection component', () => {
    beforeEachProviders(() => [
      CollectionComponent,
      CurrentUser,
      Error,
      CollectionsService,
      UiState,
      ApiConfig,
      UiConfig,
      ROUTER_FAKE_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provideStore({collections: collections,
                    focusedCollection: focusedCollection,
                    uiState: uiState,
                    currentUser: currentUser}),
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

    it('Create instance of Collection',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(CollectionComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof CollectionComponent).toBeTruthy();
        });
      }));

    it('Should have a selectFocusedCollection method that updates a users focused collection',
      inject([CollectionComponent], (component: CollectionComponent) => {
        spyOn(component.collectionsService, 'setFocusedCollection').and.returnValue(Observable.of(mockCollection()));
        spyOn(component.collectionsService, 'updateFocusedCollection');
        component.selectFocusedCollection(mockCollection());
        expect(component.collectionsService.setFocusedCollection).toHaveBeenCalledWith(158);
        expect(component.collectionsService.updateFocusedCollection).toHaveBeenCalledWith(mockCollection());
      }));

    it('Should have a getFocusedCollection method that gets a user\'s focused collection',
      inject([CollectionComponent], (component: CollectionComponent) => {
        spyOn(component.collectionsService, 'getFocusedCollection').and.returnValue(Observable.of(mockCollection()));
        spyOn(component.collectionsService, 'updateFocusedCollection');
        setTimeout(() => {
          component.getFocusedCollection();
          expect(component.collectionsService.getFocusedCollection).toHaveBeenCalled();
          expect(component.collectionsService.updateFocusedCollection).toHaveBeenCalledWith(Observable.of(mockCollection()));
        }, 1200);
      }));

    it('Should have a isFocusedCollection method that checks if a user\'s collection is focused',
      inject([CollectionComponent], (component: CollectionComponent) => {
        spyOn(component.store, 'getState').and.returnValue(mockUnfocusedCollection());
        expect(component.isFocusedCollection(mockCollection())).toBe(false);
      }));

    it('Should have a deleteCollection method that deletes a collection and updates the focused collection',
      inject([CollectionComponent], (component: CollectionComponent) => {
        spyOn(component.collectionsService, 'deleteCollection').and.returnValue(Observable.of(mockCollection()));
        spyOn(component.collectionsService, 'deleteCollectionFromStore');
        component.deleteCollection(mockCollection());
        expect(component.collectionsService.deleteCollection).toHaveBeenCalledWith(158);
        expect(component.collectionsService.deleteCollectionFromStore).toHaveBeenCalledWith(mockCollection());
      }));

    function mockCollection() {
      return {
        'lastUpdated':'2016-06-17T21:44:12Z',
        'createdOn':'2016-06-17T21:44:12Z',
        'id':158,
        'siteName':'core',
        'name':'golf',
        'owner':'ross.edfort@wazeedigital.com',
        'assets':[123456],
        'tags':['golf','green','sport']
      };
    }

    function mockUnfocusedCollection() {
      return {
        'focusedCollection': {
          'lastUpdated':'2016-06-17T21:44:12Z',
          'createdOn':'2016-06-17T21:44:12Z',
          'id':159,
          'siteName':'core',
          'name':'cats',
          'owner':'ross.edfort@wazeedigital.com',
          'assets':[126226],
          'tags':['meow','cat','feline']
        }
      };
    }
  });
}
