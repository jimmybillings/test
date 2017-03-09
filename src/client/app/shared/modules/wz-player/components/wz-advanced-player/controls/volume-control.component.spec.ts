import { VolumeControlComponent } from './volume-control.component';
import { PlayerRequestType } from '../../../interfaces/player.interface';

export function main() {
  describe('Volume Control Component', () => {
    let componentUnderTest: VolumeControlComponent;
    let mockPlayerState: any;

    beforeEach(() => {
      componentUnderTest = new VolumeControlComponent();
      mockPlayerState = { volume: 100 };
      componentUnderTest.playerState = mockPlayerState;
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    it('starts with active === false', () => {
      expect(componentUnderTest.active).toBe(false);
    });

    it('starts with expected buttonTitle', () => {
      expect(componentUnderTest.buttonTitle).toBe('ASSET.ADV_PLAYER.SOUND_BTN_TITLE');
    });

    describe('iconName getter', () => {
      const tests = [
        { volume: 100, expectedResult: 'volume_up' },
        { volume: 67, expectedResult: 'volume_up' },
        { volume: 66, expectedResult: 'volume_down' },
        { volume: 65, expectedResult: 'volume_down' },
        { volume: 34, expectedResult: 'volume_down' },
        { volume: 33, expectedResult: 'volume_mute' },
        { volume: 32, expectedResult: 'volume_mute' },
        { volume: 1, expectedResult: 'volume_mute' },
        { volume: 0, expectedResult: 'volume_off' }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for volume = ${test.volume}`, () => {
          mockPlayerState.volume = test.volume;

          expect(componentUnderTest.iconName).toEqual(test.expectedResult);
        });
      });
    });

    describe('onMouseOver()', () => {
      it('sets active to true', () => {
        componentUnderTest.onMouseOver();

        expect(componentUnderTest.active).toBe(true);
      });
    });

    describe('onMouseLeave()', () => {
      it('restores active to false', () => {
        componentUnderTest.onMouseOver();
        componentUnderTest.onMouseLeave();

        expect(componentUnderTest.active).toBe(false);
      });
    });

    describe('onSliderChange()', () => {
      it('requests a volume change', () => {
        componentUnderTest.onSliderChange({ value: 42 });

        expect(componentUnderTest.request.emit)
          .toHaveBeenCalledWith({ type: PlayerRequestType.SetVolume, payload: { volume: 42 } });
      });
    });

    describe('onButtonClick()', () => {
      it('requests a mute toggle', () => {
        componentUnderTest.onButtonClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.ToggleMute });
      });
    });
  });
}
