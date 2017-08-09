import { WzDropdownPortalDirective } from './wz.dropdown.component';

export function main() {
  xdescribe('Wz Dropdown Portal Directive', () => {
    let componentUnderTest: WzDropdownPortalDirective;

    beforeEach(() => {
      componentUnderTest = new WzDropdownPortalDirective(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

