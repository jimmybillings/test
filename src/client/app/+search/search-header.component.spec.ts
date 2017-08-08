import { SearchHeaderComponent } from './search-header.component';

export function main() {
  xdescribe('Search Header Component', () => {
    let componentUnderTest: SearchHeaderComponent;

    beforeEach(() => {
      componentUnderTest = new SearchHeaderComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
