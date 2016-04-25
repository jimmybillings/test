import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { ContentService } from './content.service';
import { ApiConfig } from '../../common/config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http, ResponseOptions, Response } from 'angular2/http';

export function main() {
  describe('Content service', () => {
    
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ContentService,
      ApiConfig
    ]);
    
    it('Should formulate a correct query url for a CMS page and map the response body.',
      inject([ContentService, MockBackend], (service, mockBackend) => {
       let connection;
        connection = mockBackend.connections.subscribe(c => connection = c);
        service.get('terms-conditions').subscribe((res) => {
          expect(connection.request.url).toBe('http://ec2-52-32-235-105.us-west-2.compute.amazonaws.com/core/wp-json/wp/v2/pages?filter[name]=terms-conditions');
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
