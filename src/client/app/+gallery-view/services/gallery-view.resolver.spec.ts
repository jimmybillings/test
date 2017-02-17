import { GalleryViewResolver } from './gallery-view.resolver';

export function main() {
  describe('Gallery View Resolver', () => {
    let resolverUnderTest: GalleryViewResolver;
    let mockRoute: any, mockState: any;

    beforeEach(() => {
      resolverUnderTest = new GalleryViewResolver();
      mockRoute = null;
      mockState = null;
    });

    it('resolve() should return fake data for now', () => {
      resolverUnderTest.resolve(mockRoute, mockState).subscribe((data: any) => {
        expect(data).toEqual({ some: 'data' });
      });
    });
  });
}
