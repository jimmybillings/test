import { MarkerSeekButtonComponent } from './marker-seek-button.component';
import { PlayerState, PlayerRequestType } from '../../../interfaces/player.interface';
import { Frame } from 'wazee-frame-formatter';

export function main() {
  describe('Marker Seek Button', () => {
    let componentUnderTest: MarkerSeekButtonComponent;

    beforeEach(() => {
      componentUnderTest = new MarkerSeekButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');

      componentUnderTest.playerState = {
        inMarkerFrame: new Frame(29.97).setFromFrameNumber(18),
        outMarkerFrame: new Frame(29.97).setFromFrameNumber(58)
      } as PlayerState;
    });

    describe('For type \'in\'', () => {
      beforeEach(() => {
        componentUnderTest.type = 'in';
      });

      it('the frame getter returns the expected value', () => {
        expect(componentUnderTest.frame.frameNumber).toBe(18);
      });

      it('the class getter returns the expected value', () => {
        expect(componentUnderTest.class).toBe('seek-in');
      });

      it('the title getter returns the expected value', () => {
        expect(componentUnderTest.title).toBe('ASSET.ADV_PLAYER.SEEK_IN_BTN_TITLE');
      });

      it('onClick() emits the expected event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.SeekToInMarker });
      });
    });

    describe('For type \'out\'', () => {
      beforeEach(() => {
        componentUnderTest.type = 'out';
      });

      it('the frame getter returns the expected value', () => {
        expect(componentUnderTest.frame.frameNumber).toBe(58);
      });

      it('the class getter returns the expected value', () => {
        expect(componentUnderTest.class).toBe('seek-out');
      });

      it('the title getter returns the expected value', () => {
        expect(componentUnderTest.title).toBe('ASSET.ADV_PLAYER.SEEK_OUT_BTN_TITLE');
      });

      it('onClick() emits the expected event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: PlayerRequestType.SeekToOutMarker });
      });
    });
  });
}
