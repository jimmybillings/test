import { MarkersPlaybackButtonComponent } from './markers-playback-button.component';
import { PlayerRequestType } from '../../../interfaces/player.interface';

export function main() {
  describe('Markers Playback Button Component', () => {
    let componentUnderTest: MarkersPlaybackButtonComponent;

    beforeEach(() => {
      componentUnderTest = new MarkersPlaybackButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('onClick()', () => {
      it('emits the expected request event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.ToggleMarkersPlayback });
      });
    });
  });
}
