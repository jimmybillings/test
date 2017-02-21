import { GalleryViewStore } from './gallery-view.store';

export function main() {
  describe('Gallery View Store', () => {
    let storeUnderTest: GalleryViewStore;

    beforeEach(() => {
      storeUnderTest = new GalleryViewStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
