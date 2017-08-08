import { EqualValidatorDirective } from './wz-equal-validator.directive';

export function main() {
  xdescribe('Equal Validator Directive', () => {
    let directiveUnderTest: EqualValidatorDirective;

    beforeEach(() => {
      directiveUnderTest = new EqualValidatorDirective(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

