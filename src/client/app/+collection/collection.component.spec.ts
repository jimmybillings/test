import { CollectionComponent } from './collection.component';

export function main() {
  describe('Collection Component', () => {
    let componentUnderTest: CollectionComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
