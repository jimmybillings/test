import { WzComingSoonComponent } from './wz-coming-soon.component';

export function main() {
  xdescribe('Wz Coming Soon Component', () => {
    let componentUnderTest: WzComingSoonComponent;

    beforeEach(() => {
      componentUnderTest = new WzComingSoonComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
