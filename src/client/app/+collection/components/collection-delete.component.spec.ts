import { CollectionDeleteComponent } from './collection-delete.component';

export function main() {
  xdescribe('Collection Delete Component', () => {
    let componentUnderTest: CollectionDeleteComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionDeleteComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
