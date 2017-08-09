import { WzFormComponent } from './wz.form.component';

export function main() {
  xdescribe('Wz Form Component', () => {
    let componentUnderTest: WzFormComponent;

    beforeEach(() => {
      componentUnderTest = new WzFormComponent(null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
