import { WzAsperaDownloadDirective } from './aspera-download.directive';

export function main() {
  xdescribe('Wz Aspera Download Directive', () => {
    let directiveUnderTest: WzAsperaDownloadDirective;

    beforeEach(() => {
      directiveUnderTest = new WzAsperaDownloadDirective(null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
