import { CommerceConfirmTab } from './commerce-confirm-tab';

export function main() {
  describe('Confirm Tab Component', () => {
    let componentUnderTest: CommerceConfirmTab;

    beforeEach(() => {
      componentUnderTest = new CommerceConfirmTab(null, null, null);
    });

    it('has no functionality yet', () => {
      expect(true).toBe(true);
    });
  });
};
