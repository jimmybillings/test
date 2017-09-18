import { ProjectInfoComponent } from './project-info.component';

export function main() {
  describe('Project Info Component', () => {
    let componentUnderTest: ProjectInfoComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectInfoComponent();
      componentUnderTest.showEditDialog.emit = jasmine.createSpy('edit emitter');
    });

    describe('onEditButtonClick()', () => {
      it('emits an showEditDialog request if readOnly is false', () => {
        componentUnderTest.readOnly = false;
        componentUnderTest.onEditClick();

        expect(componentUnderTest.showEditDialog.emit).toHaveBeenCalled();
      });
    });
  });
}
