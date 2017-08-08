import { WzTestValidator } from './wz.test-validator';

export function main() {
  xdescribe('Wz Test Validator', () => {
    let validatorUnderTest: WzTestValidator;

    beforeEach(() => {
      validatorUnderTest = new WzTestValidator();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

