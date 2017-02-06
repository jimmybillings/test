import { PlayerStateService } from './player-state.service';
import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerStateChanges } from '../interfaces/player.interface';

export function main() {
  const frameNumberFor = (seconds: number, framesPerSecond: number = 29.97): number => {
    return new Frame(framesPerSecond).setFromSeconds(seconds).asFrameNumber();
  };

  describe('Player State Service', () => {
    let serviceUnderTest: PlayerStateService;

    beforeEach(() => {
      serviceUnderTest = new PlayerStateService();
    });

    describe('state getter', () => {
      it('returns an Observable of the current state', () => {
        serviceUnderTest.state.subscribe((state: PlayerState) => {
          expect(state).toEqual(jasmine.objectContaining({
            canSupportCustomControls: true,
            playing: false,
            framesPerSecond: 29.97,
            currentFrame: undefined,
            durationFrame: undefined,
            inMarkerFrame: undefined,
            outMarkerFrame: undefined
          }));
        });
      });
    });

    describe('snapshot getter', () => {
      it('returns a one-time copy of the current state', () => {
        expect(serviceUnderTest.snapshot).toEqual(jasmine.objectContaining({
          canSupportCustomControls: true,
          playing: false,
          framesPerSecond: 29.97,
          currentFrame: undefined,
          durationFrame: undefined,
          inMarkerFrame: undefined,
          outMarkerFrame: undefined
        }));
      });
    });

    describe('updateWith()', () => {
      it('updates the current state Observable', () => {
        serviceUnderTest.updateWith({ playing: true });

        serviceUnderTest.state.subscribe((state: PlayerState) => {
          expect(state).toEqual(jasmine.objectContaining({
            canSupportCustomControls: true,
            playing: true,
            framesPerSecond: 29.97,
            currentFrame: undefined,
            durationFrame: undefined,
            inMarkerFrame: undefined,
            outMarkerFrame: undefined
          }));
        });
      });

      it('updates the snapshot', () => {
        serviceUnderTest.updateWith({ framesPerSecond: 23.976 });

        expect(serviceUnderTest.snapshot).toEqual(jasmine.objectContaining({
          canSupportCustomControls: true,
          playing: false,
          framesPerSecond: 23.976,
          currentFrame: undefined,
          durationFrame: undefined,
          inMarkerFrame: undefined,
          outMarkerFrame: undefined
        }));
      });

      it('creates a new value for changeDetectionEnabler', () => {
        const originalValue: number = serviceUnderTest.snapshot.changeDetectionEnabler;

        serviceUnderTest.updateWith({ playing: true });

        expect(serviceUnderTest.snapshot.changeDetectionEnabler).not.toEqual(originalValue);
      });
    });

    describe('reset()', () => {
      it('reverts to the initial state', () => {
        serviceUnderTest.updateWith({ playing: true, duration: 1234.123, currentTime: 173.174 });

        serviceUnderTest.reset();

        expect(serviceUnderTest.snapshot).toEqual(jasmine.objectContaining({
          canSupportCustomControls: true,
          playing: false,
          framesPerSecond: 29.97,
          currentFrame: undefined,
          durationFrame: undefined,
          inMarkerFrame: undefined,
          outMarkerFrame: undefined
        }));
      });
    });

    describe('Interdependencies', () => {
      describe('Updating with currentTime', () => {
        it('causes currentFrame to be updated', () => {
          serviceUnderTest.updateWith({ currentTime: 42.43 });

          expect(serviceUnderTest.snapshot.currentFrame.frameNumber).toBe(frameNumberFor(42.43));
        });
      });

      describe('Updating with duration', () => {
        it('causes durationFrame to be updated', () => {
          serviceUnderTest.updateWith({ duration: 24.25 });

          expect(serviceUnderTest.snapshot.durationFrame.frameNumber).toBe(frameNumberFor(24.25));
        });
      });

      describe('Updating with inMarker', () => {
        it('causes inMarkerFrame to be updated', () => {
          serviceUnderTest.updateWith({ inMarker: 1.23 });

          expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(1.23));
        });
      });

      describe('Updating with outMarker', () => {
        it('causes outMarkerFrame to be updated', () => {
          serviceUnderTest.updateWith({ outMarker: 4.56 });

          expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(4.56));
        });
      });

      describe('Updating both inMarkerFrame and outMarkerFrame', () => {
        it('sets the out marker to the in marker if the out marker is before the in marker', () => {
          serviceUnderTest.updateWith({
            inMarkerFrame: new Frame(29.97).setFromSeconds(137.138),
            outMarkerFrame: new Frame(29.97).setFromSeconds(73.74)
          });

          expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(137.138));
          expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(137.138));
        });
      });
    });
  });
}
