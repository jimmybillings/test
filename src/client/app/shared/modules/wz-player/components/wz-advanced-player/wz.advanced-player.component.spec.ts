import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { WzAdvancedPlayerComponent } from './wz.advanced-player.component';
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
        seekTo: jasmine.createSpy('seekTo'),
        playSubclip: jasmine.createSpy('playSubclip')
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

      it('returns false if the asset\'s resource type is \'Image\'', () => {
        componentUnderTest.asset = { resourceClass: 'Image' };

        expect(componentUnderTest.assetIsVideo()).toBe(false);
      });

      it('returns false if the asset has not been set', () => {
        expect(componentUnderTest.assetIsVideo()).toBe(false);
      });

      it('returns false if the asset has no resourceClass property', () => {
        componentUnderTest.asset = {};

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
              .toHaveBeenCalledWith({ in: { some: 'in marker' }, out: { some: 'out marker' } });
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
                  .toEqual([{ in: { some: 'new in marker' }, out: { some: 'new out marker' } }]);
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
              start: { in: 10, out: 20 },
              updates: [
                { next: { in: 10, out: 20 }, shouldEmit: false },
                { next: { in: 10, out: 15 }, shouldEmit: true },
                { next: { in: 10, out: undefined }, shouldEmit: true },
                { next: { in: 15, out: 20 }, shouldEmit: true },
                { next: { in: undefined, out: 20 }, shouldEmit: true },
                { next: { in: 20, out: 30 }, shouldEmit: true },
                { next: { in: undefined, out: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { in: undefined, out: 20 },
              updates: [
                { next: { in: 10, out: 20 }, shouldEmit: true },
                { next: { in: 10, out: 15 }, shouldEmit: true },
                { next: { in: 10, out: undefined }, shouldEmit: true },
                { next: { in: 15, out: 20 }, shouldEmit: true },
                { next: { in: undefined, out: 20 }, shouldEmit: false },
                { next: { in: 20, out: 30 }, shouldEmit: true },
                { next: { in: undefined, out: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { in: 10, out: undefined },
              updates: [
                { next: { in: 10, out: 20 }, shouldEmit: true },
                { next: { in: 10, out: 15 }, shouldEmit: true },
                { next: { in: 10, out: undefined }, shouldEmit: false },
                { next: { in: 15, out: 20 }, shouldEmit: true },
                { next: { in: undefined, out: 20 }, shouldEmit: true },
                { next: { in: 20, out: 30 }, shouldEmit: true },
                { next: { in: undefined, out: undefined }, shouldEmit: true }
              ]
            },
            {
              start: { in: undefined, out: undefined },
              updates: [
                { next: { in: 10, out: 20 }, shouldEmit: true },
                { next: { in: 10, out: 15 }, shouldEmit: true },
                { next: { in: 10, out: undefined }, shouldEmit: true },
                { next: { in: 15, out: 20 }, shouldEmit: true },
                { next: { in: undefined, out: 20 }, shouldEmit: true },
                { next: { in: 20, out: 30 }, shouldEmit: true },
                { next: { in: undefined, out: undefined }, shouldEmit: false }
              ]
            }
          ];

          tests.forEach((test: any) => {
            describe(`when the player is ready with ${JSON.stringify(test.start)}`, () => {
              beforeEach(() => {
                simulatedStateSubject.next({
                  ready: true,
                  inMarkerFrame: test.start.in ? { frameNumber: test.start.in } : undefined,
                  outMarkerFrame: test.start.out ? { frameNumber: test.start.out } : undefined
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
                        inMarkerFrame: update.next.in ? { frameNumber: update.next.in } : undefined,
                        outMarkerFrame: update.next.out ? { frameNumber: update.next.out } : undefined
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

    // describe('onTimeUpdate()', () => {
    //   it('sets the subclip controls component\'s currentTime property', () => {
    //     componentUnderTest.onTimeUpdate(27.453);

    //     expect(componentUnderTest.subclipControls.currentTime).toEqual(27.453);
    //   });
    // });

    // describe('onDurationUpdate()', () => {
    //   it('sets the subclip controls component\'s duration property', () => {
    //     componentUnderTest.onDurationUpdate(1234.56);

    //     expect(componentUnderTest.subclipControls.duration).toEqual(1234.56);
    //   });
    // });

    // describe('requestSeekTo()', () => {
    //   it('calls the player component\'s seekTo() method', () => {
    //     componentUnderTest.requestSeekTo(4207);

    //     expect(componentUnderTest.player.seekTo).toHaveBeenCalledWith(4207);
    //   });
    // });

    // describe('requestPlaySubclip()', () => {
    //   it('calls the player component\'s playSubclip() method', () => {
    //     componentUnderTest.requestPlaySubclip({ in: 83, out: 95 });

    //     expect(componentUnderTest.player.playSubclip).toHaveBeenCalledWith({ in: 83, out: 95 });
    //   });
    // });

    // describe('onSubclipMarkersChanged()', () => {
    //   it('emits a subclipMarkersChanged event with the new markers', () => {
    //     componentUnderTest.onSubclipMarkersChanged({ in: 100, out: 200 });

    //     expect(componentUnderTest.subclipMarkersChanged.emit).toHaveBeenCalledWith({ in: 100, out: 200 });
    //   });
    // });

    // describe('onSubclipMarkersCleared()', () => {
    //   it('emits a subclipMarkersCleared event', () => {
    //     componentUnderTest.onSubclipMarkersCleared();

    //     expect(componentUnderTest.subclipMarkersCleared.emit).toHaveBeenCalled();
    //   });
    // });
  });
}
