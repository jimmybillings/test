import { LicenseAgreementComponent } from './license-agreement.component';

export function main() {
  describe('License Agreement Component', () => {
    let componentUnderTest: LicenseAgreementComponent;

    beforeEach(() => {
      componentUnderTest = new LicenseAgreementComponent();
    });

    it('has no testable functionality', () => {
      expect(true).toBe(true);
    });
  });
}
