import { FormModel } from './wz.form.model';

export function main() {
  describe('Form Model', () => {
    let modelUnderTest: FormModel;

    beforeEach(() => {
      modelUnderTest = new FormModel();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

