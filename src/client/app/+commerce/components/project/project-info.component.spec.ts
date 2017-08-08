import { ProjectInfoComponent } from './project-info.component';

export function main() {
  xdescribe('Project Info Component', () => {
    let componentUnderTest: ProjectInfoComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectInfoComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
