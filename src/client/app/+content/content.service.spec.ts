import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { ContentService } from './content.service';
import { ApiConfig } from '../shared/services/api.config';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ResponseOptions, Response } from '@angular/http';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {RouteSegment, Router} from '@angular/router';

export function main() {
  describe('Content service', () => {

    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      provide(RouteSegment, {useFactory: (r: any) => r.routeTree.root, deps: [Router]}),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ContentService,
      ApiConfig
    ]);

    it('Should formulate a correct query url for a CMS page and map the response body.',
      inject([ContentService, MockBackend], (service: ContentService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.get('terms-conditions').subscribe((res) => {
          expect(connection.request.url).toBe('https://cms.dev.wzplatform.com/core/wp-json/wp/v2/pages?filter[name]=terms-conditions');
          expect(res).toEqual(mockContent());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockContent()
          })
        ));
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
