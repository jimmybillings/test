import { AdminAuthGuard } from './admin.auth.guard';

export function main() {
  describe('Admin Auth Guard', () => {
    let guardUnderTest: AdminAuthGuard;

    beforeEach(() => {
      guardUnderTest = new AdminAuthGuard(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

