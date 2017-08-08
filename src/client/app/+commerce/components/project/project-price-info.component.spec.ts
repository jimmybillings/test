import { ProjectPriceInfoComponent } from './project-price-info.component';

export function main() {
  xdescribe('Project Price Info Component', () => {
    let componentUnderTest: ProjectPriceInfoComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectPriceInfoComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
