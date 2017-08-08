import { WzBreadcrumbComponent } from './wz.breadcrumb.component';

export function main() {
  xdescribe('Wz Breadcrumb Component', () => {
    let componentUnderTest: WzBreadcrumbComponent;

    beforeEach(() => {
      componentUnderTest = new WzBreadcrumbComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

