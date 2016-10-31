import { EqualValidatorDirective } from './wz-equal-validator.directive';

export function main() {
  describe('Equal Validator Directive', () => {
    let directiveUnderTest: EqualValidatorDirective;

    beforeEach(() => {
      directiveUnderTest = new EqualValidatorDirective(null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

