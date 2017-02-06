import { ElementRef } from '@angular/core';

import { WzPlayerComponent } from './wz.player.component';
import { MockJwPlayer } from '../../mocks/mockJwPlayer';
import { MockVideoEventName, MockVideoElement } from '../../mocks/mockVideoElement';

export function main() {
  // Wz Player Component
  // -- For an Image
  // -- For a Video
  // ---- In basic mode
  // ---- In advanced mode
  // ------ Asset Setter

  describe('Wz Player Component', () => {
    let componentUnderTest: WzPlayerComponent;
    let stateUpdateEmitter: jasmine.Spy;
    let mockElementRef: any;
    let mockRenderer: any;
    let mockZone: any;
    let mockJwPlayer: MockJwPlayer;
    let mockVideoElement: MockVideoElement;

    const expectResetFor = (assetType: string) => {
      if (assetType === 'video' || assetType === 'html5Video') {
        expect(mockJwPlayer.remove).toHaveBeenCalled();

        if (assetType === 'html5Video') {
          expect(mockVideoElement.numberOfDefinedEventCallbacks).toBe(0);
        }

        if (componentUnderTest.mode === 'advanced') {
          expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: undefined, currentTime: 0 });
        } else {
          expect(componentUnderTest.stateUpdate.emit).not.toHaveBeenCalled();
        }
      }

      expect(mockElementRef.nativeElement.innerHtml).toEqual('');
    };

    beforeEach(() => {
      mockElementRef = { nativeElement: { innerHtml: '', appendChild: jasmine.createSpy('appendChild') } };

      mockRenderer = {
        listen: (videoElement: MockVideoElement, eventName: MockVideoEventName, callback: Function) => {
          videoElement.on(eventName, callback);
          return () => videoElement.off(eventName);
        }
      };

      mockZone = { run: jasmine.createSpy('zone').and.callFake((wrappedFunction: Function) => wrappedFunction()) };

      componentUnderTest = new WzPlayerComponent(mockElementRef, mockRenderer, mockZone);

      componentUnderTest.window = {
        jwplayer: jasmine.createSpy('jwplayer creator').and.returnValue(mockJwPlayer = new MockJwPlayer()),
        document: {
          querySelector: (selector: string) => {
            return selector === 'video' ? (mockVideoElement = new MockVideoElement()) : null;
          }
        }
      };

      componentUnderTest.stateUpdate.emit = jasmine.createSpy('stateUpdate emitter');

      stateUpdateEmitter = componentUnderTest.stateUpdate.emit as jasmine.Spy;
    });

    it('defaults to basic mode', () => {
      expect(componentUnderTest.mode).toEqual('basic');
    });

    describe('For an Image', () => {
      const mockAsset = { resourceClass: 'Image' };

      beforeEach(() => componentUnderTest.asset = mockAsset);

      describe('asset setter', () => {
        it('doesn\'t set up the player', () => {
          expect(mockJwPlayer.setup).not.toHaveBeenCalled();
        });

        it('resets the asset if an asset was present', () => {
          componentUnderTest.asset = { resourceClass: 'Image', some: 'otherProperty' };

          expectResetFor('image');
        });
      });

      describe('asset getter', () => {
        it('returns the asset', () => {
          expect(componentUnderTest.asset).toEqual(mockAsset);
        });
      });

      describe('ngOnDestroy()', () => {
        it('resets the player', () => {
          componentUnderTest.ngOnDestroy();

          expectResetFor('image');
        });
      });

      describe('togglePlayback()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.togglePlayback()).toThrowError();
        });
      });

      describe('seekTo()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.seekTo(6.867)).toThrowError();
        });
      });

      describe('seekToInMarker()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.seekToInMarker()).toThrowError();
        });
      });

      describe('seekToOutMarker()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
        });
      });

      describe('setInMarkerToCurrentTime()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.setInMarkerToCurrentTime()).toThrowError();
        });
      });

      describe('setOutMarkerToCurrentTime()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.setOutMarkerToCurrentTime()).toThrowError();
        });
      });

      describe('clearMarkers()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.clearMarkers()).toThrowError();
        });
      });

      describe('toggleMarkersPlayback()', () => {
        it('is not supported', () => {
          expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
        });
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

        it('sets up the player', () => {
          expect(mockJwPlayer.setup).toHaveBeenCalledWith({
            image: 'clipThumbnailUrl',
            file: 'clipUrl'
          });
        });

        it('resets the player if it already exists when a new asset is set', () => {
          componentUnderTest.asset = {
            resourceClass: 'AnotherNotImage',
            clipThumbnailUrl: 'anotherClipThumbnailUrl',
            clipUrl: 'anotherClipUrl'
          };

          expectResetFor('video');
        });

        describe('ngOnDestroy()', () => {
          it('resets the player', () => {
            componentUnderTest.ngOnDestroy();

            expectResetFor('video');
          });
        });

        describe('togglePlayback()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.togglePlayback()).toThrowError();
          });
        });

        describe('seekTo()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.seekTo(6.867)).toThrowError();
          });
        });

        describe('seekToInMarker()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.seekToInMarker()).toThrowError();
          });
        });

        describe('seekToOutMarker()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
          });
        });

        describe('setInMarkerToCurrentTime()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.setInMarkerToCurrentTime()).toThrowError();
          });
        });

        describe('setOutMarkerToCurrentTime()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.setOutMarkerToCurrentTime()).toThrowError();
          });
        });

        describe('clearMarkers()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.clearMarkers()).toThrowError();
          });
        });

        describe('toggleMarkersPlayback()', () => {
          it('is not supported', () => {
            expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
          });
        });
      });

      describe('in advanced mode', () => {
        beforeEach(() => {
          componentUnderTest.mode = 'advanced';
          componentUnderTest.asset = {
            resourceClass: 'NotImage',
            clipThumbnailUrl: undefined,
            clipUrl: 'clipUrl'
          };
        });

        describe('asset setter', () => {
          it('sets up the player', () => {
            expect(mockJwPlayer.setup).toHaveBeenCalledWith({
              image: null,
              file: 'clipUrl'
            });
          });

          it('resets the player if an asset was already present', () => {
            componentUnderTest.asset = {
              resourceClass: 'AnotherNotImage',
              clipThumbnailUrl: 'anotherClipThumbnailUrl',
              clipUrl: 'anotherClipUrl'
            };

            expectResetFor('video');
          });
        });

        describe('with non-HTML5 video', () => {
          beforeEach(() => mockJwPlayer.setProviderNameTo('flash'));

          describe('before \'ready\' event is triggered', () => {
            it('doesn\'t emit a \'canSupportCustomControls\' state update yet', () => {
              expect(stateUpdateEmitter).not.toHaveBeenCalledWith({ canSupportCustomControls: jasmine.any(Boolean) });
            });
          });

          describe('after \'ready\' event is triggered', () => {
            beforeEach(() => mockJwPlayer.trigger('ready'));

            it('reports canSupportCustomControls: false', () => {
              expect(stateUpdateEmitter).toHaveBeenCalledWith({ canSupportCustomControls: false });
            });

            describe('ngOnDestroy()', () => {
              it('resets the player', () => {
                componentUnderTest.ngOnDestroy();

                expectResetFor('video');
              });
            });

            describe('togglePlayback()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.togglePlayback()).toThrowError();
              });
            });

            describe('seekTo()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.seekTo(6.867)).toThrowError();
              });
            });

            describe('seekToInMarker()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.seekToInMarker()).toThrowError();
              });
            });

            describe('seekToOutMarker()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
              });
            });

            describe('setInMarkerToCurrentTime()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.setInMarkerToCurrentTime()).toThrowError();
              });
            });

            describe('setOutMarkerToCurrentTime()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.setOutMarkerToCurrentTime()).toThrowError();
              });
            });

            describe('clearMarkers()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.clearMarkers()).toThrowError();
              });
            });

            describe('toggleMarkersPlayback()', () => {
              it('is not supported', () => {
                expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
              });
            });
          });
        });

        describe('with HTML5 video', () => {
          beforeEach(() => mockJwPlayer.setProviderNameTo('html5'));

          describe('before \'ready\' event is triggered', () => {
            it('doesn\'t emit a \'canSupportCustomControls\' state update yet', () => {
              expect(stateUpdateEmitter).not.toHaveBeenCalledWith({ canSupportCustomControls: jasmine.any(Boolean) });
            });
          });

          describe('after \'ready\' event is triggered', () => {
            beforeEach(() => mockJwPlayer.trigger('ready'));

            it('reports canSupportCustomControls: true', () => {
              expect(stateUpdateEmitter).toHaveBeenCalledWith({ canSupportCustomControls: true });
            });

            describe('after reporting canSupportCustomControls', () => {
              beforeEach(() => {
                // Don't want initialization calls to affect future verifications.
                (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
              });

              describe('when \'durationchange\' event is triggered', () => {
                beforeEach(() => mockVideoElement.simulateDurationChangeTo(234.567));

                it('reports the asset\'s duration', () => {
                  expect(stateUpdateEmitter).toHaveBeenCalledWith({ duration: 234.567 });
                });
              });

              describe('ngOnDestroy()', () => {
                it('resets the player', () => {
                  componentUnderTest.ngOnDestroy();

                  expectResetFor('html5Video');
                });
              });

              describe('togglePlayback()', () => {
                // Tests herein assume autoplay is on, and thus the player is playing by default when it starts.

                describe('when playback was playing', () => {
                  it('pauses', () => {
                    componentUnderTest.togglePlayback();

                    expect(mockVideoElement.paused).toBe(true);
                  });

                  it('reports playing: false', () => {
                    componentUnderTest.togglePlayback();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                  });
                });

                describe('when playback was paused', () => {
                  beforeEach(() => componentUnderTest.togglePlayback());

                  it('plays', () => {
                    componentUnderTest.togglePlayback();

                    expect(mockVideoElement.paused).toBe(false);
                  });

                  it('reports playing: true', () => {
                    componentUnderTest.togglePlayback();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                  });
                });
              });

              describe('seekTo()', () => {
                it('doesn\'t immediately emit a currentTime status update', () => {
                  componentUnderTest.seekTo(1234.567);

                  expect(stateUpdateEmitter).not.toHaveBeenCalled();
                });

                it('reports current time after video element triggers \'seeked\'', () => {
                  componentUnderTest.seekTo(1234.567);
                  mockVideoElement.simulateSeekCompletion();

                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                  expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 1234.567 }]);
                });
              });

              describe('with no markers set', () => {
                describe('seekToInMarker()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.seekToInMarker()).toThrowError();
                  });
                });

                describe('seekToOutMarker()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
                  });
                });

                describe('setInMarkerToCurrentTime()', () => {
                  it('reports inMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(1.234);
                    componentUnderTest.setInMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 1.234 }]);
                  });
                });

                describe('setOutMarkerToCurrentTime()', () => {
                  it('reports outMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(5.678);
                    componentUnderTest.setOutMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ outMarker: 5.678 }]);
                  });
                });

                describe('clearMarkers()', () => {
                  it('reports inMarker: undefined, outMarker: undefined', () => {
                    componentUnderTest.clearMarkers();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args)
                      .toEqual([{ inMarker: undefined, outMarker: undefined }]);
                  });
                });

                describe('toggleMarkersPlayback()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
                  });
                });
              });

              describe('with just the in marker set', () => {
                beforeEach(() => {
                  mockVideoElement.simulateTimeChangeTo(1.234);
                  componentUnderTest.setInMarkerToCurrentTime();
                  mockVideoElement.simulateTimeChangeTo(47);

                  // Don't want initialization calls to affect future verifications.
                  (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                });

                describe('seekToInMarker()', () => {
                  it('reports currentTime updated to in marker', () => {
                    componentUnderTest.seekToInMarker();
                    mockVideoElement.simulateSeekCompletion();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 1.234 }]);
                  });
                });

                describe('seekToOutMarker()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
                  });
                });

                describe('setInMarkerToCurrentTime()', () => {
                  it('reports inMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(2.345);
                    componentUnderTest.setInMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 2.345 }]);
                  });
                });

                describe('setOutMarkerToCurrentTime()', () => {
                  it('reports outMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(5.678);
                    componentUnderTest.setOutMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ outMarker: 5.678 }]);
                  });

                  describe('if current time is less than in marker', () => {
                    it('moves in marker, and reports inMarker and outMarker updates', () => {
                      mockVideoElement.simulateTimeChangeTo(0.999);
                      componentUnderTest.setOutMarkerToCurrentTime();

                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 0.999, outMarker: 0.999 }]);
                    });
                  });
                });

                describe('clearMarkers()', () => {
                  it('reports inMarker: undefined, outMarker: undefined', () => {
                    componentUnderTest.clearMarkers();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args)
                      .toEqual([{ inMarker: undefined, outMarker: undefined }]);
                  });
                });
              });

              describe('with just the out marker set', () => {
                beforeEach(() => {
                  mockVideoElement.simulateTimeChangeTo(5.678);
                  componentUnderTest.setOutMarkerToCurrentTime();
                  mockVideoElement.simulateTimeChangeTo(74);

                  // Don't want initialization calls to affect future verifications.
                  (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                });

                describe('seekToInMarker()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.seekToInMarker()).toThrowError();
                  });
                });

                describe('seekToOutMarker()', () => {
                  it('reports currentTime updated to out marker', () => {
                    componentUnderTest.seekToOutMarker();
                    mockVideoElement.simulateSeekCompletion();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 5.678 }]);
                  });
                });

                describe('setInMarkerToCurrentTime()', () => {
                  it('reports inMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(2.345);
                    componentUnderTest.setInMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 2.345 }]);
                  });

                  describe('if current time is greater than out marker', () => {
                    it('moves out marker, and reports inMarker and outMarker updates', () => {
                      mockVideoElement.simulateTimeChangeTo(9.876);
                      componentUnderTest.setInMarkerToCurrentTime();

                      expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                      expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 9.876, outMarker: 9.876 }]);
                    });
                  });
                });

                describe('setOutMarkerToCurrentTime()', () => {
                  it('reports outMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(6.789);
                    componentUnderTest.setOutMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ outMarker: 6.789 }]);
                  });
                });

                describe('clearMarkers()', () => {
                  it('reports inMarker: undefined, outMarker: undefined', () => {
                    componentUnderTest.clearMarkers();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args)
                      .toEqual([{ inMarker: undefined, outMarker: undefined }]);
                  });
                });

                describe('toggleMarkersPlayback()', () => {
                  it('throws an error', () => {
                    expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
                  });
                });
              });

              describe('with both markers set', () => {
                beforeEach(() => {
                  mockVideoElement.simulateTimeChangeTo(1.234);
                  componentUnderTest.setInMarkerToCurrentTime();
                  mockVideoElement.simulateTimeChangeTo(5.678);
                  componentUnderTest.setOutMarkerToCurrentTime();
                  mockVideoElement.simulateTimeChangeTo(98.6);

                  // Don't want initialization calls to affect future verifications.
                  (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                });

                describe('seekToInMarker()', () => {
                  it('reports currentTime updated to in marker', () => {
                    componentUnderTest.seekToInMarker();
                    mockVideoElement.simulateSeekCompletion();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 1.234 }]);
                  });
                });

                describe('seekToOutMarker()', () => {
                  it('reports currentTime updated to out marker', () => {
                    componentUnderTest.seekToOutMarker();
                    mockVideoElement.simulateSeekCompletion();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 5.678 }]);
                  });
                });

                describe('setInMarkerToCurrentTime()', () => {
                  it('reports inMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(2.345);
                    componentUnderTest.setInMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 2.345 }]);
                  });
                });

                describe('setOutMarkerToCurrentTime()', () => {
                  it('reports outMarker update', () => {
                    mockVideoElement.simulateTimeChangeTo(6.789);
                    componentUnderTest.setOutMarkerToCurrentTime();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ outMarker: 6.789 }]);
                  });
                });

                describe('clearMarkers()', () => {
                  it('reports inMarker: undefined, outMarker: undefined', () => {
                    componentUnderTest.clearMarkers();

                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                    expect(stateUpdateEmitter.calls.mostRecent().args)
                      .toEqual([{ inMarker: undefined, outMarker: undefined }]);
                  });
                });

                describe('toggleMarkersPlayback()', () => {
                  [{ initialState: 'paused' }, { initialState: 'playing' }].forEach(test => {
                    describe(`when playback was initially ${test.initialState}`, () => {
                      let seekingEventTriggerCount: number;

                      beforeEach(() => {
                        seekingEventTriggerCount = 0;
                        mockVideoElement.on('seeking', () => seekingEventTriggerCount += 1);

                        if (test.initialState === 'paused') {
                          componentUnderTest.togglePlayback();

                          // Don't want initialization calls to affect future verifications.
                          (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                        }

                        componentUnderTest.toggleMarkersPlayback();
                      });

                      describe('before \'seeked\' event is triggered', () => {
                        it('seeks', () => {
                          expect(seekingEventTriggerCount).toBe(1);
                        });

                        it('emits no stateUpdates yet', () => {
                          expect(stateUpdateEmitter).not.toHaveBeenCalled();
                        });

                        describe('and toggleMarkersPlayback() is somehow immediately called again', () => {
                          beforeEach(() => componentUnderTest.toggleMarkersPlayback());

                          if (test.initialState === 'paused') {
                            it('is still paused', () => {
                              expect(mockVideoElement.paused).toBe(true);
                            });
                          } else {
                            it('is still playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          }

                          it('still emits no stateUpdates', () => {
                            expect(stateUpdateEmitter).not.toHaveBeenCalled();
                          });

                          it('doesn\'t seek again', () => {
                            expect(seekingEventTriggerCount).toBe(1);
                          });
                        });
                      });

                      describe('after \'seeked\' event is triggered', () => {
                        beforeEach(() => mockVideoElement.simulateSeekCompletion());

                        if (test.initialState === 'paused') {
                          it('reports playingMarkers: true, playing: true, current time', () => {
                            expect(stateUpdateEmitter.calls.allArgs())
                              .toEqual([
                                [{ playingMarkers: true }],
                                [{ playing: true }],
                                [{ currentTime: 1.234 }]
                              ]);
                          });
                        } else {
                          it('reports playingMarkers: true, current time', () => {
                            expect(stateUpdateEmitter.calls.allArgs())
                              .toEqual([
                                [{ playingMarkers: true }],
                                [{ currentTime: 1.234 }]
                              ]);
                          });
                        }

                        it('is playing', () => {
                          expect(mockVideoElement.paused).toBe(false);
                        });

                        describe('when a time less than the out marker is reported', () => {
                          beforeEach(() => mockVideoElement.simulateTimeChangeTo(5.677));

                          it('reports current time', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 4 : 3);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 5.677 }]);
                          });

                          it('is still playing', () => {
                            expect(mockVideoElement.paused).toBe(false);
                          });
                        });

                        describe('when toggleMarkersPlayback() is called before the out marker is reached', () => {
                          beforeEach(() => componentUnderTest.toggleMarkersPlayback());

                          it('doesn\'t seek again', () => {
                            expect(seekingEventTriggerCount).toBe(1);
                          });

                          it('reports playing: false', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 4 : 3);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                          });

                          it('is paused', () => {
                            expect(mockVideoElement.paused).toBe(true);
                          });

                          describe('and toggleMarkersPlayback() is called again', () => {
                            beforeEach(() => componentUnderTest.toggleMarkersPlayback());

                            it('doesn\'t seek again', () => {
                              expect(seekingEventTriggerCount).toBe(1);
                            });

                            it('reports playing: true', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                              expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                            });

                            it('is playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          });

                          describe('and togglePlayback() is called', () => {
                            beforeEach(() => componentUnderTest.togglePlayback());

                            it('doesn\'t seek again', () => {
                              expect(seekingEventTriggerCount).toBe(1);
                            });

                            it('reports playing: true', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                              expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                            });

                            it('is playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          });
                        });

                        describe('when togglePlayback() is called before the out marker is reached', () => {
                          beforeEach(() => componentUnderTest.togglePlayback());

                          it('doesn\'t seek again', () => {
                            expect(seekingEventTriggerCount).toBe(1);
                          });

                          it('reports playing: false', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 4 : 3);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: false }]);
                          });

                          it('is paused', () => {
                            expect(mockVideoElement.paused).toBe(true);
                          });

                          describe('and togglePlayback() is called again', () => {
                            beforeEach(() => componentUnderTest.togglePlayback());

                            it('doesn\'t seek again', () => {
                              expect(seekingEventTriggerCount).toBe(1);
                            });

                            it('reports playing: true', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                              expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                            });

                            it('is playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          });

                          describe('and toggleMarkersPlayback() is called', () => {
                            beforeEach(() => componentUnderTest.toggleMarkersPlayback());

                            it('doesn\'t seek again', () => {
                              expect(seekingEventTriggerCount).toBe(1);
                            });

                            it('reports playing: true', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                              expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playing: true }]);
                            });

                            it('is playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          });
                        });

                        describe('when a seek is requested before the out marker is reached', () => {
                          beforeEach(() => componentUnderTest.seekTo(123));

                          it('reports playingMarkers: false', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 4 : 3);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playingMarkers: false }]);
                          });

                          it('is still playing', () => {
                            expect(mockVideoElement.paused).toBe(false);
                          });

                          describe('and a later time event is somehow reported', () => {
                            beforeEach(() => mockVideoElement.simulateTimeChangeTo(6));

                            it('reports the current time', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                              expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 6 }]);
                            });

                            it('is still playing', () => {
                              expect(mockVideoElement.paused).toBe(false);
                            });
                          });
                        });

                        describe('when setInMarkerToCurrentTime() is called before the out marker is reached', () => {
                          beforeEach(() => {
                            mockVideoElement.simulateTimeChangeTo(3); // happens because the player is playing
                            componentUnderTest.setInMarkerToCurrentTime();
                          });

                          it('reports current time and inMarker update', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 5 : 4);
                            expect(stateUpdateEmitter.calls.allArgs().slice(-2))
                              .toEqual([
                                [{ currentTime: 3 }],
                                [{ inMarker: 3 }]
                              ]);
                          });

                          it('is still playing', () => {
                            expect(mockVideoElement.paused).toBe(false);
                          });
                        });

                        describe('when setOutMarkerToCurrentTime() is called before the out marker is reached', () => {
                          beforeEach(() => {
                            mockVideoElement.simulateTimeChangeTo(4); // happens because the player is playing
                            componentUnderTest.setOutMarkerToCurrentTime();
                          });

                          it('reports current time, playing: false, playingMarkers: false, outMarker update', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 7 : 6);

                            expect(stateUpdateEmitter.calls.allArgs().slice(-4))
                              .toEqual([
                                [{ currentTime: 4 }],
                                [{ playing: false }],
                                [{ playingMarkers: false }],
                                [{ outMarker: 4 }]
                              ]);
                          });

                          it('is paused', () => {
                            expect(mockVideoElement.paused).toBe(true);
                          });
                        });

                        describe('when clearMarkers() is called before the out marker is reached', () => {
                          beforeEach(() => {
                            mockVideoElement.simulateTimeChangeTo(3.5); // happens because the player is playing
                            componentUnderTest.clearMarkers();
                          });

                          it('reports current time, playingMarkers: false, outMarker update', () => {
                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 6 : 5);

                            expect(stateUpdateEmitter.calls.allArgs().slice(-3))
                              .toEqual([
                                [{ currentTime: 3.5 }],
                                [{ playingMarkers: false }],
                                [{ inMarker: undefined, outMarker: undefined }]
                              ]);
                          });

                          it('is still playing', () => {
                            expect(mockVideoElement.paused).toBe(false);
                          });
                        });

                        [{ condition: 'equal to', time: 5.678 }, { condition: 'greater than', time: 5.679 }].forEach(innerTest => {
                          describe(`as soon as a time ${innerTest.condition} the out marker is reported`, () => {
                            beforeEach(() => mockVideoElement.simulateTimeChangeTo(innerTest.time));

                            it('reports current time, playing: false, playingMarkers: false', () => {
                              expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 6 : 5);

                              expect(stateUpdateEmitter.calls.allArgs().slice(-3))
                                .toEqual([
                                  [{ currentTime: innerTest.time }],
                                  [{ playing: false }],
                                  [{ playingMarkers: false }]
                                ]);
                            });

                            it('is paused', () => {
                              expect(mockVideoElement.paused).toBe(true);
                            });

                            if (innerTest.condition === 'greater than') {
                              it('seeks back to the out marker', () => {
                                expect(seekingEventTriggerCount).toBe(2);
                              });

                              it('emits no additional stateUpdates', () => {
                                expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 6 : 5);
                              });

                              it('is still paused', () => {
                                expect(mockVideoElement.paused).toBe(true);
                              });

                              describe('after \'seeked\' event is triggered', () => {
                                beforeEach(() => mockVideoElement.simulateSeekCompletion());

                                it('reports current time', () => {
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(test.initialState === 'paused' ? 7 : 6);
                                  expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 5.678 }]);
                                });

                                it('is still paused', () => {
                                  expect(mockVideoElement.paused).toBe(true);
                                });
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
          });
        });
      });
    });
  });
}
