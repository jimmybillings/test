import { AdminStore } from './admin.store';

export function main() {
  describe('Admin Store', () => {
    let storeUnderTest: AdminStore;

    beforeEach(() => {
      storeUnderTest = new AdminStore(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

