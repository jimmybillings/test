import { Observable } from 'rxjs/Rx';

import { GalleryViewResolver } from './gallery-view.resolver';

export function main() {
  describe('Gallery View Resolver', () => {
    let resolverUnderTest: GalleryViewResolver;
    let mockService: any;
    let mockRoute: any;

    beforeEach(() => {
      mockService = { load: jasmine.createSpy('load').and.returnValue(Observable.of({ some: 'object' })) };
      mockRoute = { params: { ids: '1~~~2', names: 'Name_1~~~Name_2' } };

      resolverUnderTest = new GalleryViewResolver(mockService);
    });

    describe('resolve()', () => {
      it('tells the service to load children for the appropriate path', () => {
        resolverUnderTest.resolve(mockRoute);

        expect(mockService.load).toHaveBeenCalledWith([{ ids: [1], names: ['Name 1'] }, { ids: [2], names: ['Name 2'] }]);
      });

      it('returns the service\'s returned observable', () => {
        resolverUnderTest.resolve(mockRoute).subscribe(returnObject => expect(returnObject).toEqual({ some: 'object' }));
      });
    });
  });
}
