import { HomeCallToActionComponent } from './home-call-to-action.component';

export function main() {
  xdescribe('Home Call To Action Component', () => {
    let componentUnderTest: HomeCallToActionComponent;

    beforeEach(() => {
      componentUnderTest = new HomeCallToActionComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
