import { WzTermsComponent } from './wz.terms.component';

export function main() {
  describe('Terms Component', () => {
    let componentUnderTest: WzTermsComponent;

    beforeEach(() => {
      componentUnderTest = new WzTermsComponent();
    });

    describe('agreeToTerms()', () => {
      it('should emit an event', () => {
        spyOn(componentUnderTest.close, 'emit');
        componentUnderTest.agreeToTerms();

        expect(componentUnderTest.close.emit).toHaveBeenCalled();
      });
    });
  });
}
