import { NoResultsComponent } from './no-results.component';

export function main() {
  xdescribe('No Results Component', () => {
    let componentUnderTest: NoResultsComponent;

    beforeEach(() => {
      componentUnderTest = new NoResultsComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
