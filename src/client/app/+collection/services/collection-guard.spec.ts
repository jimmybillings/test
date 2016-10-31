import { CollectionGuard } from './collection-guard';

export function main() {
  describe('Collection Guard', () => {
    let guardUnderTest: CollectionGuard;

    beforeEach(() => {
      guardUnderTest = new CollectionGuard(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

