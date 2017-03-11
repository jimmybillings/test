import { WzFormComponent } from './wz.form.component';

export function main() {
  describe('Wz Form Component', () => {
    let componentUnderTest: WzFormComponent;

    beforeEach(() => {
      componentUnderTest = new WzFormComponent(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
