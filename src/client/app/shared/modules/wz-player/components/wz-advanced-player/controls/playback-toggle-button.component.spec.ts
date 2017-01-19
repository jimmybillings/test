import { PlaybackToggleButtonComponent } from './playback-toggle-button.component';
import { PlayerRequestType } from '../../../interfaces/player.interface';

export function main() {
  describe('Playback Toggle Button Component', () => {
    let componentUnderTest: PlaybackToggleButtonComponent;

    beforeEach(() => {
      componentUnderTest = new PlaybackToggleButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('onClick()', () => {
      it('emits the expected request event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.TogglePlayback });
      });
    });
  });
}
