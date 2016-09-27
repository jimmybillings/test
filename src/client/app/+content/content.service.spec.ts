import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../imports/test.imports';

import { ContentService } from './content.service';

export function main() {
  describe('Content service', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        ContentService
      ]
    }));

    it('Should formulate a correct query url for a CMS page and map the response body.',
      inject([ContentService, MockBackend], (service: ContentService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.get('terms-conditions').subscribe((res) => {
          expect(connection.request.url.split('.com')[1]).toBe('/core/wp-json/wp/v2/pages?filter[name]=terms-conditions');
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
