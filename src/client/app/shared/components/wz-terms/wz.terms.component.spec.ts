import { WzTermsComponent } from './wz.terms.component';

export function main() {
  describe('Terms Component', () => {
    let componentUnderTest: WzTermsComponent;

    beforeEach(() => {
      componentUnderTest = new WzTermsComponent();
      componentUnderTest.dialog = {
        close: jasmine.createSpy('close')
      };
    });

    describe('agreeToTerms()', () => {
      it('should emit an event', () => {
        componentUnderTest.agreeToTerms();

        expect(componentUnderTest.dialog.close).toHaveBeenCalled();
      });
    });
  });
}
