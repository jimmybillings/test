import { WzDropdownPortalDirective } from './wz.dropdown.component';

export function main() {
  describe('Wz Dropdown Portal Directive', () => {
    let componentUnderTest: WzDropdownPortalDirective;

    beforeEach(() => {
      componentUnderTest = new WzDropdownPortalDirective(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

