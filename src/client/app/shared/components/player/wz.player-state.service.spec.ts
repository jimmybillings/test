import { WzPlayerStateService } from './wz.player-state.service';
import { Frame } from 'wazee-frame-formatter';
import { WzPlayerState, WzPlayerStateChanges } from './wz.player.interface';

export function main() {
  describe('Wz Player State Service', () => {
    let serviceUnderTest: WzPlayerStateService;

    beforeEach(() => {
      serviceUnderTest = new WzPlayerStateService();
    });

    describe('state getter', () => {
      it('returns an Observable of the current state', () => {
        serviceUnderTest.state.subscribe((state: WzPlayerState) => {
          expect(state).toEqual(jasmine.objectContaining({
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

        serviceUnderTest.state.subscribe((state: WzPlayerState) => {
          expect(state).toEqual(jasmine.objectContaining({
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

        it('causes inMarkerFrame to be set if it wasn\'t already', () => {
          serviceUnderTest.updateWith({ duration: 24.25 });

          expect(serviceUnderTest.snapshot.inMarkerFrame.asSeconds()).toEqual(0);
        });

        it('doesn\'t cause inMarkerFrame to be updated if it was already set', () => {
          serviceUnderTest.updateWith({ inMarkerFrame: new Frame(29.97).setFromSeconds(17.18) });

          serviceUnderTest.updateWith({ duration: 24.25 });

          expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(17.18));
        });

        it('causes outMarkerFrame to be set if it wasn\'t already', () => {
          serviceUnderTest.updateWith({ duration: 24.25 });

          expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(24.25));
        });

        it('doesn\'t cause outMarkerFrame to be updated if it was already set', () => {
          serviceUnderTest.updateWith({ outMarkerFrame: new Frame(29.97).setFromSeconds(22.23) });

          serviceUnderTest.updateWith({ duration: 82.83 });

          expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(22.23));
        });
      });

      describe('Updating with inMarker', () => {
        beforeEach(() => {
          serviceUnderTest.updateWith({ currentTime: 92.93 });
        });

        it('throws an error when called with something unexpected', () => {
          expect(() => serviceUnderTest.updateWith({ inMarker: 'blah' } as any)).toThrowError();
        });

        describe('with neither marker already set', () => {
          describe('as \'currentFrame\'', () => {
            it('sets the in marker to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(92.93));
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });
          });

          describe('as \'clear\'', () => {
            it('sets the in marker to zero', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });
          });
        });

        describe('with in marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ inMarkerFrame: new Frame(29.97).setFromSeconds(12.13) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the in marker to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(92.93));
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });
          });

          describe('as \'clear\'', () => {
            it('sets the in marker to zero', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });
          });
        });

        describe('with out marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ outMarkerFrame: new Frame(29.97).setFromSeconds(108.109) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the in marker to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(92.93));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(108.109));
            });

            it('also moves the out marker if the current frame is beyond it', () => {
              serviceUnderTest.updateWith({ currentTime: 136.137 });

              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(136.137));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(136.137));
            })
          });

          describe('as \'clear\'', () => {
            it('sets the in marker to zero', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(108.109));
            });
          });
        });

        describe('with both markers already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({
              inMarkerFrame: new Frame(29.97).setFromSeconds(22.23),
              outMarkerFrame: new Frame(29.97).setFromSeconds(204.205)
            });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the in marker to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(92.93));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(204.205));
            });

            it('also moves the out marker if the current frame is beyond it', () => {
              serviceUnderTest.updateWith({ currentTime: 217.218 });

              serviceUnderTest.updateWith({ inMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(217.218));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(217.218));
            })
          });

          describe('as \'clear\'', () => {
            it('sets the in marker to zero', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(204.205));
            });
          });
        });
      });

      describe('Updating with outMarker', () => {
        beforeEach(() => {
          serviceUnderTest.updateWith({ currentTime: 58.59 });
        });

        it('throws an error when called with something unexpected', () => {
          expect(() => serviceUnderTest.updateWith({ outMarker: 'blah' } as any)).toThrowError();
        });

        describe('with neither marker already set', () => {
          describe('as \'currentFrame\'', () => {
            it('sets the out marker to the current frame', () => {
              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame).toBeUndefined();
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(58.59));
            });
          });

          describe('as \'clear\'', () => {
            it('undefines the out marker when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame).toBeUndefined();
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the out marker to the duration', () => {
              serviceUnderTest.updateWith({ duration: 554.555 });

              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(554.555));
            });
          });
        });

        describe('with in marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ inMarkerFrame: new Frame(29.97).setFromSeconds(26.27) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the out marker to the current frame', () => {
              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(26.27));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(58.59));
            });

            it('also moves the in marker if the current frame is before it', () => {
              serviceUnderTest.updateWith({ currentTime: 20.21 });

              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(20.21));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(20.21));
            })
          });

          describe('as \'clear\'', () => {
            it('undefines the out marker when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(26.27));
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the out marker to the duration', () => {
              serviceUnderTest.updateWith({ duration: 298.299 });

              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(26.27));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(298.299));
            });
          });
        });

        describe('with out marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ outMarkerFrame: new Frame(29.97).setFromSeconds(174.175) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the out marker to the current frame', () => {
              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame).toBeUndefined();
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(58.59));
            });
          });

          describe('as \'clear\'', () => {
            it('undefines the out marker when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame).toBeUndefined();
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the out marker to the duration', () => {
              serviceUnderTest.updateWith({ duration: 712.713 });

              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(712.713));
            });
          });
        });

        describe('with both markers already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({
              inMarkerFrame: new Frame(29.97).setFromSeconds(42.43),
              outMarkerFrame: new Frame(29.97).setFromSeconds(321.322)
            });
          });

          describe('as \'currentFrame\'', () => {
            it('sets the out marker to the current frame', () => {
              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(42.43));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(58.59));
            });

            it('also moves the in marker if the current frame is before it', () => {
              serviceUnderTest.updateWith({ currentTime: 31.32 });

              serviceUnderTest.updateWith({ outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(31.32));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(31.32));
            })
          });

          describe('as \'clear\'', () => {
            it('undefines the out marker when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(42.43));
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the out marker to the duration', () => {
              serviceUnderTest.updateWith({ duration: 147.148 });

              serviceUnderTest.updateWith({ outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(42.43));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(147.148));
            });
          });
        });
      });

      describe('Updating with both inMarker and outMarker', () => {
        beforeEach(() => {
          serviceUnderTest.updateWith({ currentTime: 86.87 });
        });

        it('throws an error when called with something unexpected', () => {
          expect(() => serviceUnderTest.updateWith({ outMarker: 'blah' } as any)).toThrowError();
        });

        describe('with neither marker already set', () => {
          describe('as \'currentFrame\'', () => {
            it('sets both markers to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
            });
          });

          describe('as \'clear\'', () => {
            it('sets the markers to 0 and undefined when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the markers to the edges when duration is set', () => {
              serviceUnderTest.updateWith({ duration: 301.302 });

              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(301.302));
            });
          });
        });

        describe('with in marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ inMarkerFrame: new Frame(29.97).setFromSeconds(26.27) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets both markers to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
            });

            it('sets both markers to the current frame even if the current frame is before the previous in marker', () => {
              serviceUnderTest.updateWith({ currentTime: 63.64 });

              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(63.64));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(63.64));
            })
          });

          describe('as \'clear\'', () => {
            it('sets the markers to 0 and undefined when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the markers to the edges when the duration is set', () => {
              serviceUnderTest.updateWith({ duration: 402.403 });

              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(402.403));
            });
          });
        });

        describe('with out marker already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({ outMarkerFrame: new Frame(29.97).setFromSeconds(174.175) });
          });

          describe('as \'currentFrame\'', () => {
            it('sets both markers to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
            });
          });

          describe('as \'clear\'', () => {
            it('sets the markers to 0 and undefined when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the markers to the edges when the duration is set', () => {
              serviceUnderTest.updateWith({ duration: 298.299 });

              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(298.299));
            });
          });
        });

        describe('with both markers already set', () => {
          beforeEach(() => {
            serviceUnderTest.updateWith({
              inMarkerFrame: new Frame(29.97).setFromSeconds(60.61),
              outMarkerFrame: new Frame(29.97).setFromSeconds(188.189)
            });
          });

          describe('as \'currentFrame\'', () => {
            it('sets both markers to the current frame', () => {
              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(86.87));
            });

            it('sets both markers to the current frame even if the current frame is before the previous in marker', () => {
              serviceUnderTest.updateWith({ currentTime: 51.52 });

              serviceUnderTest.updateWith({ inMarker: 'currentFrame', outMarker: 'currentFrame' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(frameNumberFor(51.52));
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(51.52));
            })
          });

          describe('as \'clear\'', () => {
            it('sets the markers to 0 and undefined when duration isn\'t set', () => {
              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame).toBeUndefined();
            });

            it('sets the markers to the edges when the duration is set', () => {
              serviceUnderTest.updateWith({ duration: 623.624 });

              serviceUnderTest.updateWith({ inMarker: 'clear', outMarker: 'clear' });

              expect(serviceUnderTest.snapshot.inMarkerFrame.frameNumber).toBe(0);
              expect(serviceUnderTest.snapshot.outMarkerFrame.frameNumber).toBe(frameNumberFor(623.624));
            });
          });
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

  const frameNumberFor = (seconds: number, framesPerSecond: number = 29.97): number => {
    return new Frame(framesPerSecond).setFromSeconds(seconds).asFrameNumber();
  }
}
