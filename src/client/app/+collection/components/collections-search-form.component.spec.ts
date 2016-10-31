import { CollectionsSearchFormComponent } from './collections-search-form.component';

export function main() {
  describe('Collections Search Form Component', () => {
    let componentUnderTest: CollectionsSearchFormComponent;
    let mockFormBuilder: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockFormBuilder = { group: () => { return; } };

      componentUnderTest = new CollectionsSearchFormComponent(mockFormBuilder);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

