import { MarkersSaveButtonComponent } from './markers-save-button.component';

export function main() {
  describe('Markers Save Button Component', () => {
    let componentUnderTest: MarkersSaveButtonComponent;

    beforeEach(() => {
      componentUnderTest = new MarkersSaveButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('onClick()', () => {
      it('emits the expected request event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: 'SAVE_MARKERS' });
      });
    });
  });
}
