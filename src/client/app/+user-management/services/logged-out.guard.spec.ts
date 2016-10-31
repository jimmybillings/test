import { LoggedOutGuard } from './logged-out.guard';

export function main() {
  describe('Logged Out Guard', () => {
    let guardUnderTest: LoggedOutGuard;

    beforeEach(() => {
      guardUnderTest = new LoggedOutGuard(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

