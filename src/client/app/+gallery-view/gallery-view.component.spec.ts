import { GalleryViewComponent } from './gallery-view.component';

export function main() {
  describe('Gallery View Component', () => {
    let componentUnderTest: GalleryViewComponent;

    beforeEach(() => {
      componentUnderTest = new GalleryViewComponent(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
