import { WzCollectionValidator } from './wz.collection-validator';

export function main() {
  xdescribe('Wz Collection Validator', () => {
    let validatorUnderTest: WzCollectionValidator;

    beforeEach(() => {
      validatorUnderTest = new WzCollectionValidator();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

