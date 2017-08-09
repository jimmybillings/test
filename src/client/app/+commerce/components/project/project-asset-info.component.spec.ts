import { ProjectAssetInfoComponent } from './project-asset-info.component';

export function main() {
  xdescribe('Project Asset Info Component', () => {
    let componentUnderTest: ProjectAssetInfoComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectAssetInfoComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
