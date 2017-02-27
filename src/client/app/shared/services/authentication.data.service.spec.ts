import { Authentication } from './authentication.data.service';

export function main() {
  describe('Authentication', () => {
    let serviceUnderTest: Authentication;

    beforeEach(() => {
      serviceUnderTest = new Authentication(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
