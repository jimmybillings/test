import { GalleryViewService } from './gallery-view.service';

export function main() {
  describe('Gallery View Service', () => {
    let serviceUnderTest: GalleryViewService;

    beforeEach(() => {
      serviceUnderTest = new GalleryViewService(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
