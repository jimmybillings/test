import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders,
inject
} from 'angular2/testing';

import {Content} from './content.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig, config} from '../../common/config/ui.config';
import {ContentService} from './content.service';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Content Component', () => {
    class MockContentService {
      get(page) {
        return Observable.of(mockContent());
      }
    }
    beforeEachProviders(() => [
      Content,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Content }),
      provide(Router, { useClass: RootRouter }),
      provide(RouteParams, { useValue: new RouteParams({ page: 'terms-conditions' }) }),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({config: config}),
      provide(ContentService, {useClass: MockContentService}),
      CurrentUser,
      UiConfig,
      ApiConfig
    ]);

    it('Create instance of Content Component',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Content).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Content).toBeTruthy();
        });
      }));
    
    it('Should call the Content service and assign the HTML response to title and content variables', inject([Content], (service) => {
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
