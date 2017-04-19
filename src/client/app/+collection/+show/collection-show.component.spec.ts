import { CollectionShowComponent } from './collection-show.component';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent;
    let mockWindow: any;

    beforeEach(() => {
      mockWindow = { nativeWindow: { location: { href: {} }, innerWidth: 200 } };
      componentUnderTest = new CollectionShowComponent(
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, mockWindow, null, null, null
      );
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
