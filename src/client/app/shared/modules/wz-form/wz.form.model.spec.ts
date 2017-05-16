import { FormModel } from './wz.form.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ValidationError = 'required' | 'minlength' | 'pattern' | 'tooLow';

const InputTypes = {
  number: { name: 'control', type: 'number', value: '', min: '1' },
  generic: { name: 'control', type: 'text', value: '' },
};

interface TestCase {
  case: string;
  validationResult: 'pass' | 'fail';
  error: ValidationError;
}

interface TestCases {
  validation: string;
  type: Object;
  cases: Array<TestCase>;
}

export function main() {
  const fb = new FormBuilder();
  describe('Form Model', () => {
    describe('validators', () => {
      const tests: TestCases[] = [
        {
          validation: 'GREATER_THAN',
          type: InputTypes.number,
          cases: [
            { case: '1', validationResult: 'fail', error: 'tooLow' },
            { case: '-1', validationResult: 'fail', error: 'tooLow' },
            { case: '0.999999', validationResult: 'fail', error: 'tooLow' },
            { case: '1.000001', validationResult: 'pass', error: 'tooLow' },
            { case: '100', validationResult: 'pass', error: 'tooLow' }
          ]
        },
        {
          validation: 'GREATER_THAN',
          type: InputTypes.generic,
          cases: [
            { case: '10000000', validationResult: 'pass', error: 'tooLow' },
            { case: '-10000000', validationResult: 'pass', error: 'tooLow' }
          ]
        },
        {
          validation: 'REQUIRED',
          type: InputTypes.generic,
          cases: [
            { case: null, validationResult: 'fail', error: 'required' },
            { case: 'value', validationResult: 'pass', error: 'required' }
          ]
        },
        {
          validation: 'EMAIL',
          type: InputTypes.generic,
          cases: [
            { case: 'r@f.o', validationResult: 'fail', error: 'pattern' },
            { case: 'r@@', validationResult: 'fail', error: 'minlength' },
            { case: 'r@@', validationResult: 'fail', error: 'pattern' },
            { case: 'ross.edfort@@wazeedigital.com', validationResult: 'fail', error: 'pattern' },
            { case: 'ross.edfort@wazeedigital.com', validationResult: 'pass', error: 'minlength' },
            { case: 'ross.edfort@wazeedigital.com', validationResult: 'pass', error: 'pattern' },
            { case: 'ross.edfort@wazeedigital.com', validationResult: 'pass', error: 'required' },
            { case: 'ross.edfort+1@wazeedigital.com', validationResult: 'pass', error: 'pattern' }
          ]
        },
        {
          validation: 'PASSWORD',
          type: InputTypes.generic,
          cases: [
            { case: 'a', validationResult: 'fail', error: 'minlength' },
            { case: null, validationResult: 'fail', error: 'required' },
            { case: 'abc123!@#', validationResult: 'pass', error: 'minlength' },
            { case: 'abc123!@#', validationResult: 'pass', error: 'required' }
          ]
        }
      ];

      tests.forEach((group: TestCases) => {
        let form: FormGroup;
        let modelUnderTest: FormModel = new FormModel();

        beforeEach(() => {
          let config: any = Object.assign(group.type, { validation: group.validation });
          form = fb.group(modelUnderTest.create([config]));
        });

        describe(`${group.validation}`, () => {
          group.cases.forEach((test: TestCase) => {
            it(`${test.validationResult === 'pass' ? 'doesn\'t have' : 'has'} a "${test.error}" error for "${test.case}"`, () => {
              form.controls['control'].setValue(test.case);

              if (test.validationResult === 'pass') {
                expect(form.controls['control'].errors).toBeNull();
              } else {
                expect(form.controls['control'].errors.hasOwnProperty(test.error)).toBe(true);
              }
            });
          });
        });
      });
    });
  });
};

