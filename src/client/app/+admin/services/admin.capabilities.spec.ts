import { AdminCapabilities } from './admin.capabilities';

export function main() {
  describe('Admin Capabilities', () => {
    let mockCurrentUserService: any;
    let capabilitiesUnderTest: AdminCapabilities;

    describe('viewAdmin() - user has Root permission', () => {
      beforeEach(() => {
        mockCurrentUserService = { hasPermission: (permission: string) => ['Root'].indexOf(permission) > -1 };
        capabilitiesUnderTest = new AdminCapabilities(mockCurrentUserService);
      });

      it('returns true', () => {
        expect(capabilitiesUnderTest.viewAdmin()).toBe(true);
      });
    });

    describe('viewAdmin() - user does not have Root permission', () => {
      beforeEach(() => {
        mockCurrentUserService = { hasPermission: (permission: string) => ['NotRoot'].indexOf(permission) > -1 };
        capabilitiesUnderTest = new AdminCapabilities(mockCurrentUserService);
      });

      it('returns false', () => {
        expect(capabilitiesUnderTest.viewAdmin()).toBe(false);
      });
    });
  });
};
