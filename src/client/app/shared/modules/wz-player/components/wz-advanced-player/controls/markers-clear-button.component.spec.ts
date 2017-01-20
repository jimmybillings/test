import { MarkersClearButtonComponent } from './markers-clear-button.component';
import { PlayerRequestType } from '../../../interfaces/player.interface';

export function main() {
  describe('Markers Clear Button Component', () => {
    let componentUnderTest: MarkersClearButtonComponent;

    beforeEach(() => {
      componentUnderTest = new MarkersClearButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('onClick()', () => {
      it('emits the expected request event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.ClearMarkers });
      });
    });
  });
}
