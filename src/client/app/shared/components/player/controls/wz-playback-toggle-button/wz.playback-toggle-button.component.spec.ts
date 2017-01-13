import { WzPlaybackToggleButtonComponent } from './wz.playback-toggle-button.component';
import { WzPlayerRequestType } from '../../wz.player.interface';

export function main() {
  describe('Wz Playback Toggle Button Component', () => {
    let componentUnderTest: WzPlaybackToggleButtonComponent;

    beforeEach(() => {
      componentUnderTest = new WzPlaybackToggleButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('onClick()', () => {
      it('emits the expected request event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: WzPlayerRequestType.TogglePlayback });
      });
    });
  });
}
