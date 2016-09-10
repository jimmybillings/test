import {
  beforeEachProvidersArray,
  ActivatedRoute,
  Observable,
  inject,
  TestBed
} from '../imports/test.imports';

import { ContentComponent} from './content.component';
import { ContentService} from './content.service';

export function main() {
  describe('Content Component', () => {
    class MockContentService {
      get(page: Async) {
        return Observable.of(mockContent());
      }
    }
    class MockActivatedRoute {
      public params: Observable<any>;
      constructor() {
        this.params = Observable.of({page: 'terms-conditions'});
      }
    }
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        ContentComponent,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ContentService, useClass: MockContentService }
      ]
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
