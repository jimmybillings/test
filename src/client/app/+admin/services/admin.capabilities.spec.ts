import { Observable } from 'rxjs/Rx';

import { AdminCapabilities } from './admin.capabilities';

export function main() {
  describe('Admin Capabilities', () => {
    let mockCurrentUser: any;
    let capabilitiesUnderTest: AdminCapabilities;

    describe('viewAdmin() - user has Root permission', () => {
      beforeEach(() => {
        mockCurrentUser = { hasPermission: (permission: string) => ['Root'].indexOf(permission) > -1 };
        capabilitiesUnderTest = new AdminCapabilities(mockCurrentUser);
      });

      it('returns true', () => {
        expect(capabilitiesUnderTest.viewAdmin()).toBe(true);
      });
    });

    describe('viewAdmin() - user does not have Root permission', () => {
      beforeEach(() => {
        mockCurrentUser = { hasPermission: (permission: string) => ['NotRoot'].indexOf(permission) > -1 };
        capabilitiesUnderTest = new AdminCapabilities(mockCurrentUser);
      });

      it('returns false', () => {
        expect(capabilitiesUnderTest.viewAdmin()).toBe(false);
      });
    });
  });
};
