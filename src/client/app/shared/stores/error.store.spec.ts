import { ErrorStore } from './error.store';

export function main() {
  describe('Error Store', () => {
    let storeUnderTest: ErrorStore;

    beforeEach(() => {
      storeUnderTest = new ErrorStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
