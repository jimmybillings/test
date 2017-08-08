// TODO: Uncomment all commented lines after fixing 'require' issue.
import { CollectionLinkComponent } from './collection-link.component';

export function main() {
  xdescribe('Collection Link Component', () => {
    let componentUnderTest: CollectionLinkComponent;

    beforeEach(() => {
      componentUnderTest = new CollectionLinkComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

