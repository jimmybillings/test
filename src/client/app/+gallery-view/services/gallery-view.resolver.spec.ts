import { GalleryViewResolver } from './gallery-view.resolver';

export function main() {
  describe('Gallery View Resolver', () => {
    let resolverUnderTest: GalleryViewResolver;
    let mockRoute: any, mockState: any;

    beforeEach(() => {
      resolverUnderTest = new GalleryViewResolver(null);
      mockRoute = null;
      mockState = null;
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
