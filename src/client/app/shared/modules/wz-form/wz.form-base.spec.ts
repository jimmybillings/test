import { WzFormBase } from './wz.form-base';

export function main() {
  describe('Wz Form Base', () => {
    let baseUnderTest: WzFormBase;

    beforeEach(() => {
      baseUnderTest = new WzFormBase(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
