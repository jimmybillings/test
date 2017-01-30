import { WzTestValidator } from './wz.test-validator';

export function main() {
  describe('Wz Test Validator', () => {
    let validatorUnderTest: WzTestValidator;

    beforeEach(() => {
      validatorUnderTest = new WzTestValidator();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

