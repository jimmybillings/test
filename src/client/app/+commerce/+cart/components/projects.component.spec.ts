import { ProjectsComponent } from './projects.component';

export function main() {
  describe('Projects Component', () => {
    let componentUnderTest: ProjectsComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectsComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
