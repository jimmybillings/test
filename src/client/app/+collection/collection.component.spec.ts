import { CollectionComponent } from './collection.component';

export function main() {
  xdescribe('Collection Component', () => {
    let componentUnderTest: CollectionComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
