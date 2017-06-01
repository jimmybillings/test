import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WzAdvancedPlayerComponent } from './wz.advanced-player.component';
import { Frame } from 'wazee-frame-formatter';
import { PlayerStateChanges } from '../../interfaces/player.interface';

export function main() {
  describe('Wazee Advanced Player Component', () => {
    let componentUnderTest: WzAdvancedPlayerComponent;
    let mockPlayerStateService: any;
    let simulatedStateSubject: BehaviorSubject<any>;
    let simulatedStateObservable: Observable<any>;

    beforeEach(() => {
      simulatedStateSubject = new BehaviorSubject({});
      simulatedStateObservable = simulatedStateSubject.asObservable();

      mockPlayerStateService = {
        reset: jasmine.createSpy('reset'),
        updateWith: jasmine.createSpy('updateWith'),
        state: simulatedStateObservable
      };

      componentUnderTest = new WzAdvancedPlayerComponent(mockPlayerStateService);

      componentUnderTest.markersInitialization.emit = jasmine.createSpy('markersInitialization emitter');
      componentUnderTest.markerChange.emit = jasmine.createSpy('markerChange emitter');
      componentUnderTest.markerSaveButtonClick.emit = jasmine.createSpy('markerSaveButtonClick emitter');

      componentUnderTest.player = {
        clearMarkers: jasmine.createSpy('clearMarkers'),
        playAtSpeed: jasmine.createSpy('playAtSpeed'),
        seekTo: jasmine.createSpy('seekTo'),
        seekToInMarker: jasmine.createSpy('seekToInMarker'),
        seekToOutMarker: jasmine.createSpy('seekToOutMarker'),
        setInMarkerToCurrentTime: jasmine.createSpy('setInMarkerToCurrentTime'),
        setOutMarkerToCurrentTime: jasmine.createSpy('setOutMarkerToCurrentTime'),
        setVolumeTo: jasmine.createSpy('setVolumeTo'),
        toggleMarkersPlayback: jasmine.createSpy('toggleMarkersPlayback'),
        toggleMute: jasmine.createSpy('toggleMute'),
        togglePlayback: jasmine.createSpy('togglePlayback')
      } as any;

      componentUnderTest.ngOnInit();
    });

    describe('asset setter', () => {
      it('sets the current asset', () => {
        componentUnderTest.asset = { some: 'asset' };

        expect(componentUnderTest.asset).toEqual({ some: 'asset' });
      });
    });

    describe('assetIsVideo()', () => {
      it('returns true if the asset\'s resource type is anything but \'Image\'', () => {
        componentUnderTest.asset = { resourceClass: 'whatever' };

        expect(componentUnderTest.assetIsVideo()).toBe(true);
      });

      it('returns true if the asset has no resourceClass property', () => {
        componentUnderTest.asset = {};

        expect(componentUnderTest.assetIsVideo()).toBe(true);
      });

      it('returns false if the asset\'s resource type is \'Image\'', () => {
        componentUnderTest.asset = { resourceClass: 'Image' };

        expect(componentUnderTest.assetIsVideo()).toBe(false);
      });

      it('returns false if the asset has not been set', () => {
        expect(componentUnderTest.assetIsVideo()).toBe(false);
      });
    });

    describe('markersInitialization output', () => {
      describe('when an asset is loaded', () => {
        beforeEach(() => {
          componentUnderTest.asset = { some: 'asset' };
        });

        describe('before the player is ready', () => {
          it('is not emitted yet', () => {
            expect(componentUnderTest.markersInitialization.emit).not.toHaveBeenCalled();
          });
        });

        describe('when the player is ready', () => {
          beforeEach(() => {
            simulatedStateSubject.next({
              ready: true,
              inMarkerFrame: { some: 'in marker' },
              outMarkerFrame: { some: 'out marker' }
            });
          });

          it('is emitted', () => {
            expect(componentUnderTest.markersInitialization.emit)
              .toHaveBeenCalledWith({ inFrame: { some: 'in marker' }, outFrame: { some: 'out marker' } });
          });

          describe('and the player state is updated again', () => {
            beforeEach(() => {
              simulatedStateSubject.next({
                inMarkerFrame: { some: 'other in marker' },
                outMarkerFrame: { some: 'other out marker' }
              });
            });

            it('is not emitted again', () => {
              expect(componentUnderTest.markersInitialization.emit).toHaveBeenCalledTimes(1);
            });
          });

          describe('and a different asset is loaded', () => {
            beforeEach(() => {
              componentUnderTest.asset = { some: 'other asset' };
            });

            describe('and when the player is not ready yet', () => {
              it('is not emitted again yet', () => {
                expect(componentUnderTest.markersInitialization.emit).toHaveBeenCalledTimes(1);
              });
            });

            describe('and when the player is ready', () => {
              beforeEach(() => {
                simulatedStateSubject.next({
                  ready: true,
                  inMarkerFrame: { some: 'new in marker' },
                  outMarkerFrame: { some: 'new out marker' }
                });
              });

              it('is emitted again', () => {
                expect(componentUnderTest.markersInitialization.emit).toHaveBeenCalledTimes(2);
                expect((componentUnderTest.markersInitialization.emit as jasmine.Spy).calls.mostRecent().args)
                  .toEqual([{ inFrame: { some: 'new in marker' }, outFrame: { some: 'new out marker' } }]);
              });
            });
          });
        });
      });

      describe('markerChange output', () => {
        describe('when an asset is loaded', () => {
          beforeEach(() => {
            componentUnderTest.asset = { some: 'asset' };
          });

          describe('before the player is ready', () => {
            it('is not emitted', () => {
              expect(componentUnderTest.markerChange.emit).not.toHaveBeenCalled();
            });
          });

          let tests: any = [
            {
              start: { inMilliseconds: 10, outMilliseconds: 20 },
              updates: [
                { next: { inMilliseconds: 10, outMilliseconds: 20 }, shouldEmit: false },
                { next: { inMilliseconds: 10, outMilliseconds: 15 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: undefined }, shouldEmit: true },
                { next: { inMilliseconds: 15, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 20, outMilliseconds: 30 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { inMilliseconds: undefined, outMilliseconds: 20 },
              updates: [
                { next: { inMilliseconds: 10, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: 15 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: undefined }, shouldEmit: true },
                { next: { inMilliseconds: 15, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: 20 }, shouldEmit: false },
                { next: { inMilliseconds: 20, outMilliseconds: 30 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { inMilliseconds: 10, outMilliseconds: undefined },
              updates: [
                { next: { inMilliseconds: 10, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: 15 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: undefined }, shouldEmit: false },
                { next: { inMilliseconds: 15, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 20, outMilliseconds: 30 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { inMilliseconds: undefined, outMilliseconds: undefined },
              updates: [
                { next: { inMilliseconds: 10, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: 15 }, shouldEmit: true },
                { next: { inMilliseconds: 10, outMilliseconds: undefined }, shouldEmit: true },
                { next: { inMilliseconds: 15, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: 20 }, shouldEmit: true },
                { next: { inMilliseconds: 20, outMilliseconds: 30 }, shouldEmit: true },
                { next: { inMilliseconds: undefined, outMilliseconds: undefined }, shouldEmit: false }
              ]
            }
          ];

          tests.forEach((test: any) => {
            describe(`when the player is ready with ${JSON.stringify(test.start)}`, () => {
              beforeEach(() => {
                simulatedStateSubject.next({
                  ready: true,
                  inMarkerFrame: test.start.inMilliseconds ? { frameNumber: test.start.inMilliseconds } : undefined,
                  outMarkerFrame: test.start.outMilliseconds ? { frameNumber: test.start.outMilliseconds } : undefined
                });
              });

              it('is not emitted', () => {
                expect(componentUnderTest.markerChange.emit).not.toHaveBeenCalled();
              });

              describe('and the player state is updated', () => {
                test.updates.forEach((update: any) => {
                  describe(`with ${JSON.stringify(update.next)}`, () => {
                    beforeEach(() => {
                      simulatedStateSubject.next({
                        inMarkerFrame: update.next.inMilliseconds ? { frameNumber: update.next.inMilliseconds } : undefined,
                        outMarkerFrame: update.next.outMilliseconds ? { frameNumber: update.next.outMilliseconds } : undefined
                      });
                    });

                    if (update.shouldEmit) {
                      it('is emitted', () => {
                        expect(componentUnderTest.markerChange.emit).toHaveBeenCalledTimes(1);
                      });
                    } else {
                      it('is not emitted', () => {
                        expect(componentUnderTest.markerChange.emit).not.toHaveBeenCalled();
                      });
                    }
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('ngOnInit()', () => {
      it('subscribes to player state changes', () => {
        spyOn(simulatedStateObservable, 'subscribe');

        componentUnderTest.ngOnInit();

        expect(simulatedStateObservable.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from player state changes', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        simulatedStateObservable.subscribe = jasmine.createSpy('subscribe').and.returnValue(mockSubscription);

        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('onStateChangeRequest()', () => {
      it('forwards the requested state changes to PlayerStateService', () => {
        componentUnderTest.onStateChangeRequest({ some: 'changes' } as PlayerStateChanges);

        expect(mockPlayerStateService.updateWith).toHaveBeenCalledWith({ some: 'changes' });
      });
    });

    describe('handle()', () => {
      describe('CLEAR_MARKERS', () => {
        it('tells the player to clear its markers', () => {
          componentUnderTest.handle({ type: 'CLEAR_MARKERS' });

          expect(componentUnderTest.player.clearMarkers).toHaveBeenCalled();
        });
      });

      describe('PLAY_AT_SPEED', () => {
        it('tells the player to play at the requested speed', () => {
          componentUnderTest.handle({ type: 'PLAY_AT_SPEED', speed: 42, direction: 'forward' });

          expect(componentUnderTest.player.playAtSpeed).toHaveBeenCalledWith(42, 'forward');
        });
      });

      describe('SAVE_MARKERS', () => {
        it('emits the proper event if markersSaveButtonEnabled is true', () => {
          componentUnderTest.handle({ type: 'SAVE_MARKERS' });

          expect(componentUnderTest.markerSaveButtonClick.emit).toHaveBeenCalled();
        });

        it('does not emit an event if markersSaveButtonEnabled is false', () => {
          componentUnderTest.markersSaveButtonEnabled = false;

          componentUnderTest.handle({ type: 'SAVE_MARKERS' });

          expect(componentUnderTest.markerSaveButtonClick.emit).not.toHaveBeenCalled();
        });
      });

      describe('SEEK_TO_FRAME', () => {
        it('tells the player to seek to the requested frame', () => {
          componentUnderTest.handle({ type: 'SEEK_TO_FRAME', frame: new Frame(30).setFromSeconds(42) });

          expect(componentUnderTest.player.seekTo).toHaveBeenCalledWith(42);
        });

        it('does nothing if the requested frame is undefined', () => {
          componentUnderTest.handle({ type: 'SEEK_TO_FRAME', frame: undefined });

          expect(componentUnderTest.player.seekTo).not.toHaveBeenCalled();
        });
      });

      describe('SEEK_TO_MARKER', () => {
        it('tells the player to seek to the in marker if the requested marker type is \'in\'', () => {
          componentUnderTest.handle({ type: 'SEEK_TO_MARKER', markerType: 'in' });

          expect(componentUnderTest.player.seekToInMarker).toHaveBeenCalled();
        });

        it('tells the player to seek to the out marker if the requested marker type is \'out\'', () => {
          componentUnderTest.handle({ type: 'SEEK_TO_MARKER', markerType: 'out' });

          expect(componentUnderTest.player.seekToOutMarker).toHaveBeenCalled();
        });
      });

      describe('SET_MARKER_TO_CURRENT_FRAME', () => {
        it('tells the player to set the in marker to the current frame if the requested marker type is \'in\'', () => {
          componentUnderTest.handle({ type: 'SET_MARKER_TO_CURRENT_FRAME', markerType: 'in' });

          expect(componentUnderTest.player.setInMarkerToCurrentTime).toHaveBeenCalled();
        });

        it('tells the player to set the out marker to the current frame if the requested marker type is \'out\'', () => {
          componentUnderTest.handle({ type: 'SET_MARKER_TO_CURRENT_FRAME', markerType: 'out' });

          expect(componentUnderTest.player.setOutMarkerToCurrentTime).toHaveBeenCalled();
        });
      });

      describe('SET_VOLUME', () => {
        it('tells the player to set the volume to the requested level', () => {
          componentUnderTest.handle({ type: 'SET_VOLUME', volume: 11 });

          expect(componentUnderTest.player.setVolumeTo).toHaveBeenCalledWith(11);
        });
      });

      describe('TOGGLE_MARKERS_PLAYBACK', () => {
        it('tells the player to toggle playback between markers', () => {
          componentUnderTest.handle({ type: 'TOGGLE_MARKERS_PLAYBACK' });

          expect(componentUnderTest.player.toggleMarkersPlayback).toHaveBeenCalled();
        });
      });

      describe('TOGGLE_MUTE', () => {
        it('tells the player to toggle its mute state', () => {
          componentUnderTest.handle({ type: 'TOGGLE_MUTE' });

          expect(componentUnderTest.player.toggleMute).toHaveBeenCalled();
        });
      });

      describe('TOGGLE_PLAYBACK', () => {
        it('tells the player to toggle playback', () => {
          componentUnderTest.handle({ type: 'TOGGLE_PLAYBACK' });

          expect(componentUnderTest.player.togglePlayback).toHaveBeenCalled();
        });
      });
    });
  });
}
