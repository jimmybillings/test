import { WzToastPortalDirective } from './wz.toast.component';

export function main() {
  describe('Wz Toast Portal Directive', () => {
    let componentUnderTest: WzToastPortalDirective;

    beforeEach(() => {
      componentUnderTest = new WzToastPortalDirective(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

