import { WzDialogPortalDirective } from './wz.dialog.component';

export function main() {
  describe('Wz Dialog Portal Directive', () => {
    let componentUnderTest: WzDialogPortalDirective;

    beforeEach(() => {
      componentUnderTest = new WzDialogPortalDirective(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

