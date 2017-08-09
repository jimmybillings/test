import { CollectionGuard } from './collection-guard';

export function main() {
  xdescribe('Collection Guard', () => {
    let guardUnderTest: CollectionGuard;

    beforeEach(() => {
      guardUnderTest = new CollectionGuard(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

