import { ElementRef } from '@angular/core';

import { WzPlayerComponent } from './wz.player.component';
import { MockJwPlayer } from '../../mocks/mockJwPlayer';

export function main() {
  // Player Component
  // -- For an Image
  // -- For a Video
  // ---- In basic mode
  // ---- In advanced mode
  // ------ Asset Setter

  describe('Player Component', () => {
    let componentUnderTest: WzPlayerComponent;
    let stateUpdateEmitter: jasmine.Spy;
    let mockElementRef: ElementRef;
    let mockZone: any;
    let mockJwPlayer: MockJwPlayer;

    beforeEach(() => {
      mockElementRef = { nativeElement: { innerHtml: '', appendChild: jasmine.createSpy('appendChild') } };
      mockZone = { run: jasmine.createSpy('zone').and.callFake((wrappedFunction: Function) => wrappedFunction()) };

      componentUnderTest = new WzPlayerComponent(mockElementRef, mockZone);
      componentUnderTest.window = { jwplayer: (nativeElement: any) => { return mockJwPlayer = new MockJwPlayer(); } };
      componentUnderTest.stateUpdate.emit = jasmine.createSpy('stateUpdate emitter');
      stateUpdateEmitter = componentUnderTest.stateUpdate.emit as jasmine.Spy;
    });

    describe('For an Image', () => {
      beforeEach(() => {
        componentUnderTest.asset = {
          resourceClass: 'Image'
        };
      });

      it('should have a default mode', () => {
        expect(componentUnderTest.mode).toEqual('basic');
      });

      it('should have an asset getter', () => {
        expect(componentUnderTest.asset).toEqual({ resourceClass: 'Image' });
      });
    });

    describe('For a Video', () => {
      // Test where this.mode === 'basic'
      describe('in basic mode', () => {
        beforeEach(() => {
          componentUnderTest.mode = 'basic';
          componentUnderTest.asset = {
            resourceClass: 'NotImage',
            clipThumbnailUrl: 'clipThumbnailUrl',
            clipUrl: 'clipUrl'
          };
        });

        it('should set up the player', () => {
          expect(mockJwPlayer.setup).toHaveBeenCalledWith({
            image: 'clipThumbnailUrl',
            file: 'clipUrl',
            logo: {
              file: 'assets/img/logo/watermark.png',
              position: 'top-right',
              link: 'http://www.wazeedigital.com'
            }
          });
        });

        it('ngOnDestroy() should reset the player', () => {
          componentUnderTest.ngOnDestroy();

          expect(mockJwPlayer.pause).toHaveBeenCalledWith(true);
          expect(mockJwPlayer.remove).toHaveBeenCalled();
          expect(componentUnderTest.stateUpdate.emit).not.toHaveBeenCalled();
          expect(mockElementRef.nativeElement.innerHtml).toEqual('');
        });

        it('togglePlayback() should call .play() on the player', () => {
          componentUnderTest.togglePlayback();

          expect(mockJwPlayer.play).toHaveBeenCalled();
        });

        it('seekTo() should call .seek() on the player with the timeInSeconds', () => {
          componentUnderTest.seekTo(6.867);

          expect(mockJwPlayer.seek).toHaveBeenCalledWith(6.867);
        });

        it('toggleMarkersPlayback() should throw a new TypeError', () => {
          expect(() => { componentUnderTest.toggleMarkersPlayback(1.234, 5.678); })
            .toThrowError('Must be in advanced mode to play subclip.');
        });

        it('should reset the player if it already exists when a new asset is set', () => {
          const previousMockJwPlayer: MockJwPlayer = mockJwPlayer;

          componentUnderTest.asset = {
            resourceClass: 'AnotherNotImage',
            clipThumbnailUrl: 'anotherClipThumbnailUrl',
            clipUrl: 'anotherClipUrl'
          };

          expect(previousMockJwPlayer.pause).toHaveBeenCalledWith(true);
          expect(previousMockJwPlayer.remove).toHaveBeenCalled();
          expect(mockJwPlayer).not.toBe(previousMockJwPlayer);
        });
      });

      describe('in advanced mode', () => {
        // Tests where this.mode === 'advanced'
        beforeEach(() => {
          componentUnderTest.mode = 'advanced';
          componentUnderTest.asset = {
            resourceClass: 'NotImage',
            clipThumbnailUrl: undefined,
            clipUrl: 'clipUrl'
          };
        });

        describe('ngOnDestroy()', () => {
          it('should reset the player', () => {
            componentUnderTest.ngOnDestroy();

            expect(mockJwPlayer.pause).toHaveBeenCalledWith(true);
            expect(mockJwPlayer.remove).toHaveBeenCalled();
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: undefined, currentTime: 0 });
            expect(mockElementRef.nativeElement.innerHtml).toEqual('');
          });
        });

        describe('Asset Setter', () => {
          it('should setup the player', () => {
            expect(mockJwPlayer.setup).toHaveBeenCalledWith({
              image: null,
              file: 'clipUrl',
              logo: {
                file: 'assets/img/logo/watermark.png',
                position: 'top-right',
                link: 'http://www.wazeedigital.com'
              }
            });
          });

          it('should reset the player if it already exists when a new asset is set', () => {
            const previousMockJwPlayer: MockJwPlayer = mockJwPlayer;

            componentUnderTest.asset = {
              resourceClass: 'AnotherNotImage',
              clipThumbnailUrl: 'anotherClipThumbnailUrl',
              clipUrl: 'anotherClipUrl'
            };

            expect(previousMockJwPlayer.pause).toHaveBeenCalledWith(true);
            expect(previousMockJwPlayer.remove).toHaveBeenCalled();
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: undefined, currentTime: 0 });
            expect(mockJwPlayer).not.toBe(previousMockJwPlayer);
          });

          it('should call handleDurationEvent which emits the stateUpdate event with the duration', () => {
            mockJwPlayer.trigger('time', { duration: 123 });

            expect(mockJwPlayer.once).toHaveBeenCalledWith('time', jasmine.any(Function));
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: 123 });
          });

          it('should call handleTimeEvents which emits the stateUpdate event with the currentTime', () => {
            mockJwPlayer.trigger('time', { position: 456 });

            expect(mockJwPlayer.on).toHaveBeenCalledWith('time', jasmine.any(Function));
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ currentTime: 456 });
          });

          describe('handlePlaybackStateEvents()', () => {
            it('should call .on() with \'play\'', () => {
              expect(mockJwPlayer.on).toHaveBeenCalledWith('play', jasmine.any(Function));
              mockJwPlayer.trigger('play');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: true });
            });

            it('should call .on() with \'pause\'', () => {
              expect(mockJwPlayer.on).toHaveBeenCalledWith('pause', jasmine.any(Function));
              mockJwPlayer.trigger('pause');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: false });
            });

            it('should call .on() with \'complete\'', () => {
              expect(mockJwPlayer.on).toHaveBeenCalledWith('complete', jasmine.any(Function));
              mockJwPlayer.trigger('complete');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: false });
            });
          });

          describe('toggleMarkersPlayback()', () => {
            [{ initialState: 'paused' }, { initialState: 'playing' }].forEach(test => {
              describe(`when playback was initially ${test.initialState}`, () => {
                beforeEach(() => {
                  // Get rid of initial duration event so that it doesn't effect future verifications.
                  mockJwPlayer.trigger('time', { position: 0, duration: 12345 });

                  if (test.initialState === 'paused') componentUnderTest.togglePlayback();

                  // Don't want initialization calls to affect future verifications.
                  (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                  mockJwPlayer.play.calls.reset();

                  componentUnderTest.toggleMarkersPlayback(1.234, 5.678);
                });

                describe('before \'seeked\' event is triggered', () => {
                  it('seeks to the in marker', () => {
                    expect(mockJwPlayer.seek).toHaveBeenCalledWith(1.234);
                  });

                  if (test.initialState === 'paused') {
                    it('reports playing: true', () => {
                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                    });
                  } else {
                    it('emits no stateUpdates yet', () => {
                      expect(stateUpdateEmitter).not.toHaveBeenCalled();
                    });
                  }

                  it('doesn\'t directly start playback', () => {
                    expect(mockJwPlayer.play).not.toHaveBeenCalled();
                  });

                  it('indirectly causes playback mode due to autoplay after seek', () => {
                    expect(mockJwPlayer.getState()).toEqual('playing');
                  });

                  describe('and toggleMarkersPlayback() is called again', () => {
                    beforeEach(() => componentUnderTest.toggleMarkersPlayback(undefined, undefined));

                    it('is still playing', () => {
                      expect(mockJwPlayer.getState()).toEqual('playing');
                    });

                    if (test.initialState === 'paused') {
                      it('emits no further state updates', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                      });
                    } else {
                      it('still emits no stateUpdates', () => {
                        expect(stateUpdateEmitter).not.toHaveBeenCalled();
                      });
                    }

                    it('doesn\'t seek again', () => {
                      expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                    });
                  });
                });

                describe('after \'seeked\' event is triggered', () => {
                  beforeEach(() => {
                    if (test.initialState === 'paused') {
                      // We sent a playing: true event.  That's tested above, so let's forget
                      // about it now so that all the future verifications work the same
                      // regardless of whether we were initially paused or playing.
                      (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                    }

                    mockJwPlayer.trigger('seeked');
                  });

                  it('reports markersPlaying: true', () => {
                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playingMarkers: true }]);
                  });

                  it('is playing', () => {
                    expect(mockJwPlayer.pause).not.toHaveBeenCalled();
                    expect(mockJwPlayer.getState()).toEqual('playing');
                  });

                  describe('when a time less than the out marker is reported', () => {
                    beforeEach(() => mockJwPlayer.trigger('time', { position: 5.677 }));

                    it('reports current time', () => {
                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);  // Playing markers + this time update
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 5.677 }]);
                    });

                    it('continues playback', () => {
                      expect(mockJwPlayer.pause).not.toHaveBeenCalled();
                      expect(mockJwPlayer.getState()).toEqual('playing');
                    });
                  });

                  describe('when toggleMarkersPlayback() is called before the out marker is reached', () => {
                    beforeEach(() => componentUnderTest.toggleMarkersPlayback(undefined, undefined));

                    it('doesn\'t seek again', () => {
                      expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                    });

                    it('reports playing: false', () => {
                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2); // Playing markers + this playing: false
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                    });

                    it('is paused', () => {
                      expect(mockJwPlayer.getState()).toEqual('paused');
                    });

                    describe('and toggleMarkersPlayback() is called again', () => {
                      beforeEach(() => componentUnderTest.toggleMarkersPlayback(undefined, undefined));

                      it('doesn\'t seek again', () => {
                        expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                      });

                      it('reports playing: true', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(3);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                      });

                      it('is playing', () => {
                        expect(mockJwPlayer.getState()).toEqual('playing');
                      });
                    });

                    describe('and togglePlayback() is called', () => {
                      beforeEach(() => componentUnderTest.togglePlayback());

                      it('doesn\'t seek again', () => {
                        expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                      });

                      it('reports playing: true', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(3);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                      });

                      it('is playing', () => {
                        expect(mockJwPlayer.getState()).toEqual('playing');
                      });
                    });
                  });

                  describe('when togglePlayback() is called before the out marker is reached', () => {
                    beforeEach(() => componentUnderTest.togglePlayback());

                    it('doesn\'t seek again', () => {
                      expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                    });

                    it('reports playing: false', () => {
                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2); // Playing markers + this playing: false
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                    });

                    it('is paused', () => {
                      expect(mockJwPlayer.getState()).toEqual('paused');
                    });

                    describe('and togglePlayback() is called again', () => {
                      beforeEach(() => componentUnderTest.togglePlayback());

                      it('doesn\'t seek again', () => {
                        expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                      });

                      it('reports playing: true', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(3);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                      });

                      it('is playing', () => {
                        expect(mockJwPlayer.getState()).toEqual('playing');
                      });
                    });

                    describe('and toggleMarkersPlayback() is called', () => {
                      beforeEach(() => componentUnderTest.toggleMarkersPlayback(undefined, undefined));

                      it('doesn\'t seek again', () => {
                        expect(mockJwPlayer.seek).toHaveBeenCalledTimes(1);
                      });

                      it('reports playing: true', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(3);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                      });

                      it('is playing', () => {
                        expect(mockJwPlayer.getState()).toEqual('playing');
                      });
                    });
                  });

                  describe('when a seek is requested before the out marker is reached', () => {
                    beforeEach(() => componentUnderTest.seekTo(123));

                    it('reports playingMarkers: false', () => {
                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playingMarkers: false }]);
                    });

                    describe('and a later time event is reported', () => {
                      beforeEach(() => mockJwPlayer.trigger('time', { position: 6 }));

                      it('reports the current time', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(3);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 6 }]);
                      });

                      it('is still playing', () => {
                        expect(mockJwPlayer.getState()).toEqual('playing');
                      });
                    });
                  });

                  [{ condition: 'equal to', time: 5.678 }, { condition: 'greater than', time: 5.679 }].forEach(test => {
                    describe(`as soon as a time ${test.condition} the out marker is reported`, () => {
                      beforeEach(() => mockJwPlayer.trigger('time', { position: test.time }));

                      it('reports current time, playing: false, playingMarkers: false', () => {
                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(4);
                        expect(stateUpdateEmitter.calls.argsFor(1)).toEqual([{ currentTime: test.time }]);
                        expect(stateUpdateEmitter.calls.argsFor(2)).toEqual([{ playing: false }]);
                        expect(stateUpdateEmitter.calls.argsFor(3)).toEqual([{ playingMarkers: false }]);
                      });

                      it('pauses playback', () => {
                        expect(mockJwPlayer.pause).toHaveBeenCalledTimes(1);
                        expect(mockJwPlayer.pause.calls.mostRecent().args).toEqual([true]);
                      });

                      if (test.condition === 'equal to') {
                        it('is paused', () => {
                          expect(mockJwPlayer.getState()).toEqual('paused');
                        });
                      }

                      if (test.condition === 'greater than') {
                        it('seeks back to the out marker', () => {
                          expect(mockJwPlayer.seek).toHaveBeenCalledWith(5.678);
                        });

                        it('emits no additional stateUpdates', () => {
                          expect(stateUpdateEmitter).toHaveBeenCalledTimes(4);
                        });

                        it('indirectly causes playback mode due to autoplay after seek', () => {
                          expect(mockJwPlayer.getState()).toEqual('playing');
                        });

                        describe('after \'seeked\' event is triggered', () => {
                          beforeEach(() => mockJwPlayer.trigger('seeked'));

                          it('reports playing: false', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(5);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                          });

                          it('is paused', () => {
                            expect(mockJwPlayer.getState()).toEqual('paused');
                          });
                        });
                      }

                      describe('when a later time event is reported', () => {
                        beforeEach(() => mockJwPlayer.trigger('time', { position: 6 }));

                        it('reports the current time', () => {
                          expect(stateUpdateEmitter).toHaveBeenCalledTimes(5);
                          expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 6 }]);
                        });

                        it('doesn\'t pause again', () => {
                          expect(mockJwPlayer.pause).toHaveBeenCalledTimes(1);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
