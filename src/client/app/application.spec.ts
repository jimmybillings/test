import { Application } from './application';

export function main() {
  describe('Application', () => {
    let applicationUnderTest: Application;

    beforeEach(() => {
      applicationUnderTest = new Application(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
