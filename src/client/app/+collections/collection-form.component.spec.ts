import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { CollectionFormComponent } from './collection-form.component';
import { CollectionsService, collections, focusedCollection } from './services/collections.service';
import { ApiConfig } from '../shared/services/api.config';
import { UiConfig } from '../shared/services/ui.config';
import { UiState, uiState } from '../shared/services/ui.state';
import { provide, Injectable } from '@angular/core';
// import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

export function main() {
  describe('Collection Form component', () => {
    @Injectable()
    class MockCollectionsService {
      public createCollection(collection: any): Observable<any> {
        return Observable.of(collection);
      }
      public createCollectionInStore(collection: any): any {
        return true;
      }
      public updateFocusedCollection(collection: any): any {
        return true;
      }
    }
    beforeEachProviders(() => [
      CollectionFormComponent,
      provide(CollectionsService, {useClass: MockCollectionsService}),
      UiState,
      ApiConfig,
      UiConfig,
      // ROUTER_FAKE_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provideStore({collections: collections, focusedCollection: focusedCollection, uiState: uiState}),
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

    it('Create instance of collection form',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(CollectionFormComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof CollectionFormComponent).toBeTruthy();
        });
      }));
  });
}
