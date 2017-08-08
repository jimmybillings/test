import { WzCcFormComponent } from './wz.cc.form.component';

export function main() {
  xdescribe('Wz Cc Form Component', () => {
    let componentUnderTest: WzCcFormComponent;

    beforeEach(() => {
      componentUnderTest = new WzCcFormComponent(null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
