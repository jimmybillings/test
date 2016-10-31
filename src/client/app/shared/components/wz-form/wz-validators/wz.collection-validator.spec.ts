import { WzCollectionValidator } from './wz.collection-validator';

export function main() {
  describe('Wz Collection Validator', () => {
    let validatorUnderTest: WzCollectionValidator;

    beforeEach(() => {
      validatorUnderTest = new WzCollectionValidator();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

