import { LicenseAgreementComponent } from './license-agreement.component';

export function main() {
  xdescribe('License Agreement Component', () => {
    let componentUnderTest: LicenseAgreementComponent;

    beforeEach(() => {
      componentUnderTest = new LicenseAgreementComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
