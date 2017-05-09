import { ProjectActionsComponent } from './project-actions.component';
export function main() {
  describe('Project Actions Component', () => {

    let componentUnderTest: ProjectActionsComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectActionsComponent();
      componentUnderTest.edit.emit = jasmine.createSpy('edit emitter');
      componentUnderTest.remove.emit = jasmine.createSpy('remove emitter');
      componentUnderTest.addFee.emit = jasmine.createSpy('addFee emitter');
    });

    describe('onEditButtonClick()', () => {
      it('emits an edit request', () => {
        componentUnderTest.onEditButtonClick();
        expect(componentUnderTest.edit.emit).toHaveBeenCalled();
      });
    });

    describe('onRemoveButtonClick()', () => {
      it('emits an remove request', () => {
        componentUnderTest.onRemoveButtonClick();
        expect(componentUnderTest.remove.emit).toHaveBeenCalled();
      });
    });

    describe('onAddFeeButtonClick()', () => {
      it('emits an addFee request', () => {
        componentUnderTest.onAddFeeButtonClick();
        expect(componentUnderTest.addFee.emit).toHaveBeenCalled();
      });
    });
  });
}
