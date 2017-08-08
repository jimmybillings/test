import { WzItemSearchFormComponent } from './wz.item-search-form.component';

export function main() {
  xdescribe('Collections Search Form Component', () => {
    let componentUnderTest: WzItemSearchFormComponent;
    let mockFormBuilder: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockFormBuilder = { group: () => { return; } };

      componentUnderTest = new WzItemSearchFormComponent(mockFormBuilder);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

