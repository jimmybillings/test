import { ErrorStore } from './error.store';

export function main() {
  xdescribe('Error Store', () => {
    let storeUnderTest: ErrorStore;

    beforeEach(() => {
      storeUnderTest = new ErrorStore(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
