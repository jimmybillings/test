import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {ContentComponent} from './content.component';
import {provide} from '@angular/core';
// import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../shared/services/api.config';
import {CurrentUser} from '../shared/services/current-user.model';
import {UiConfig, config} from '../shared/services/ui.config';
import {ContentService} from './content.service';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
// import {RouteSegment} from '@angular/router';

export function main() {
  describe('Content Component', () => {
    class MockContentService {
      get(page: Async) {
        return Observable.of(mockContent());
      }
    }
    beforeEachProviders(() => [
      ContentComponent,
      // ROUTER_FAKE_PROVIDERS,
      // provide(RouteSegment, { useValue: new RouteSegment([], { page: 'terms-conditions' }, null, null, null) }),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({ config: config }),
      provide(ContentService, { useClass: MockContentService }),
      CurrentUser,
      UiConfig,
      ApiConfig
    ]);

    it('Create instance of Content Component',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ContentComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ContentComponent).toBeTruthy();
        });
      }));

    it('Should call the Content service and assign the HTML response to title and content variables',
      inject([ContentComponent], (service: ContentComponent) => {
        spyOn(service.contentService, 'get').and.callThrough();
        service.ngOnInit();
        expect(service.contentService.get).toHaveBeenCalledWith('terms-conditions');
        expect(service.title).toEqual('CMS PAGE');
        expect(service.content).toEqual('<p>PAGE CONTENT</p>');
      }));

  });

  function mockContent() {
    return [{
      'title': {
        'rendered': 'CMS PAGE'
      },
      'content': {
        'rendered': '<p>PAGE CONTENT</p>'
      }
    }];
  }
}
