import { LoggedInGuard } from './logged-in.guard';

export function main() {
  describe('Logged In Guard', () => {
    let guardUnderTest: LoggedInGuard;

    beforeEach(() => {
      guardUnderTest = new LoggedInGuard(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

