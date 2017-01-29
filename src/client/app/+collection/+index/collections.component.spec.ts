import { CollectionsComponent } from './collections.component';

export function main() {
  describe('Collections Component', () => {
    let componentUnderTest: CollectionsComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionsComponent(null, null, null, null, null, null, null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
