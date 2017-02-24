import { Observable } from 'rxjs/Rx';

import { GalleryViewComponent } from './gallery-view.component';
import { GalleryPathSegment } from './gallery-view.interface';

export function main() {
  fdescribe('Gallery View Component', () => {
    let componentUnderTest: GalleryViewComponent;
    let mockData: any;
    let mockService: any;
    let mockRouter: any;

    beforeEach(() => {
      mockData = Observable.of({ some: 'data' });
      mockService = { data: mockData, state: { path: [{ names: ['name 1'], ids: [1] }, { names: ['name 2'], ids: [2] }] } };
      mockRouter = { navigate: jasmine.createSpy('navigate') };

      componentUnderTest = new GalleryViewComponent(mockService, mockRouter);
    });

    describe('ngOnInit()', () => {
      it('connects the data Observable to that of the service', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.data.subscribe(data => expect(data).toEqual({ some: 'data' })));
      });
    });

    describe('breadcrumbLabelFor', () => {
      it('returns empty string for an undefined segment', () => {
        expect(componentUnderTest.breadcrumbLabelFor(undefined)).toEqual('');
      });

      it('returns empty string for a null segment', () => {
        expect(componentUnderTest.breadcrumbLabelFor(null)).toEqual('');
      });

      it('returns empty string for a segment with undefined names', () => {
        expect(componentUnderTest.breadcrumbLabelFor({} as GalleryPathSegment)).toEqual('');
      });

      it('returns empty string for a segment with null names', () => {
        expect(componentUnderTest.breadcrumbLabelFor({ names: null } as GalleryPathSegment)).toEqual('');
      });

      it('returns a simple name for a segment with one name', () => {
        expect(componentUnderTest.breadcrumbLabelFor({ names: ['name 1'] } as GalleryPathSegment)).toEqual('name 1');
      });

      it('returns a compound name for a segment with two names', () => {
        expect(componentUnderTest.breadcrumbLabelFor({ names: ['name 1', 'name 2'] } as GalleryPathSegment))
          .toEqual('name 1 : name 2');
      });
    });

    describe('onClickBreadcrumb()', () => {
      it('tells the router to navigate home with index 0', () => {
        componentUnderTest.onClickBreadcrumb(0);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view']);
      });

      it('tells the router to navigate to the first path segment with index 1', () => {
        componentUnderTest.onClickBreadcrumb(1);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view', 'name._.1', '1']);
      });
    });

    describe('onNavigate()', () => {
      it('tells the router to navigate to the full path with a new segment added', () => {
        componentUnderTest.onNavigate({ pathSegment: { names: ['name 3'], ids: [3] }, method: 'nextLevel' });

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gallery-view', 'name._.1~~~name._.2~~~name._.3', '1~~~2~~~3']);
      });
    });

  });
}
