import { HomeVendorMarqueeComponent } from './home-vendor-marquee.component';

export function main() {
  xdescribe('Home Vendor Marquee Component', () => {
    let componentUnderTest: HomeVendorMarqueeComponent;

    beforeEach(() => {
      componentUnderTest = new HomeVendorMarqueeComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
