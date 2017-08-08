import { WzSiteChangerComponent } from './wz-site-changer.component';

export function main() {
  xdescribe('Wz Site Changer Component', () => {
    let componentUnderTest: WzSiteChangerComponent;

    beforeEach(() => {
      componentUnderTest = new WzSiteChangerComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
