import { AdminCapabilities } from './admin.capabilities';

export function main() {
  describe('Admin Capabilities', () => {
    let capabilitiesUnderTest: AdminCapabilities;

    beforeEach(() => {
      capabilitiesUnderTest = new AdminCapabilities(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

