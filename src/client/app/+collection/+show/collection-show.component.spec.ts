import { CollectionShowComponent } from './collection-show.component';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent;
    let mockWindow: any;

    beforeEach(() => {
      mockWindow = {};
      componentUnderTest = new CollectionShowComponent(
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, mockWindow, null);

    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
