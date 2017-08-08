import { CollectionsComponent } from './collections.component';

export function main() {
  xdescribe('Collections Component', () => {
    let componentUnderTest: CollectionsComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionsComponent(null, null, null, null, null, null, null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
