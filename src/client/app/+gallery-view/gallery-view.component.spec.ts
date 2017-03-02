import { Observable } from 'rxjs/Rx';

import { GalleryViewComponent } from './gallery-view.component';
import { GalleryPathSegment } from './gallery-view.interface';

export function main() {
  describe('Gallery View Component', () => {
    let componentUnderTest: GalleryViewComponent;
    let mockData: any, mockService: any, mockRouter: any, mockSearch: any;

    beforeEach(() => {
      mockData = Observable.of({ some: 'data' });
      mockService = {
        data: mockData,
        state: { path: [{ names: ['name 1'], ids: [1] }, { names: ['name 2'], ids: [2] }] },
        stringifyPathForSearch: jasmine.createSpy('stringifyPathForSearch').and.returnValue('3:"name 3"')
      };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockSearch = { new: jasmine.createSpy('new') };

      componentUnderTest = new GalleryViewComponent(mockService, mockRouter, mockSearch);
    });

    describe('ngOnInit()', () => {
      it('connects the data Observable to that of the service', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.data.subscribe(data => expect(data).toEqual({ some: 'data' })));
      });
    });

    describe('onClickBreadcrumb()', () => {
      it('tells the router to navigate home with index 0', () => {
        componentUnderTest.onClickBreadcrumb(0);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view']);
      });

      it('tells the router to navigate to the first path segment with index 1', () => {
        componentUnderTest.onClickBreadcrumb(1);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view', 'name_1', '1']);
      });
    });

    describe('onNavigate()', () => {
      it('tells the router to navigate to the full path with a new segment added', () => {
        componentUnderTest.onNavigate({ pathSegment: { names: ['name 3'], ids: [3] }, method: 'nextLevel' });

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view', 'name_1~~~name_2~~~name_3', '1~~~2~~~3']);
      });

      it('should do a search if the method is search', () => {
        componentUnderTest.onNavigate({ pathSegment: { names: ['name 3'], ids: [3] }, method: 'search' });

        expect(mockSearch.new).toHaveBeenCalledWith({ gq: '3:"name 3"', n: 100, i: 1 });
      });
    });

  });
}
