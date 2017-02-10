import { ElementRef } from '@angular/core';

import { WzPlayerComponent } from './wz.player.component';
import { MockJwPlayer } from '../../mocks/mockJwPlayer';
import { MockVideoEventName, MockVideoElement } from '../../mocks/mockVideoElement';

export function main() {
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
            return selector === 'video' ? (mockVideoElement = new MockVideoElement(mockJwPlayer.autoplay)) : null;
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
            clipUrl: 'clipUrl',
            someMetadata: {
              name: 'Format.FrameRate',
              value: '25'
            }
          };
        });

        it('sets up the player', () => {
          expect(mockJwPlayer.setup).toHaveBeenCalledWith({
            image: 'clipThumbnailUrl',
            file: 'clipUrl',
            autostart: true
          });
        });

        it('resets the player if it already exists when a new asset is set', () => {
          componentUnderTest.asset = {
            resourceClass: 'AnotherNotImage',
            clipThumbnailUrl: 'anotherClipThumbnailUrl',
            clipUrl: 'anotherClipUrl',
            someMetadata: {
              name: 'Format.FrameRate',
              value: '25'
            }
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
        [
          {
            state: 'no markers',
            markers: {},
            inSeconds: undefined,
            outSeconds: undefined,
            expectedAutoStart: true
          },
          {
            state: 'only timeStart',
            markers: { timeStart: '25' },
            inSeconds: 1,
            outSeconds: undefined,
            expectedAutoStart: true
          },
          {
            state: 'only timeEnd',
            markers: { timeEnd: '50' },
            inSeconds: undefined,
            outSeconds: 2,
            expectedAutoStart: true
          },
          {
            state: 'timeStart and timeEnd',
            markers: { timeStart: '25', timeEnd: '50' },
            inSeconds: 1,
            outSeconds: 2,
            expectedAutoStart: false
          }
        ].forEach(assetTest => {
          describe(`when asset has ${assetTest.state}`, () => {
            beforeEach(() => {
              componentUnderTest.mode = 'advanced';
              componentUnderTest.asset =
                Object.assign({
                  resourceClass: 'NotImage',
                  clipThumbnailUrl: undefined,
                  clipUrl: 'clipUrl',
                  someMetadata: {
                    name: 'Format.FrameRate',
                    value: '25'
                  }
                }, assetTest.markers);
            });

            describe('asset setter', () => {
              it('sets up the player with the expected settings', () => {
                expect(mockJwPlayer.setup).toHaveBeenCalledWith({
                  image: null,
                  file: 'clipUrl',
                  autostart: assetTest.expectedAutoStart
                });
              });

              it('resets the player if an asset was already present', () => {
                componentUnderTest.asset = {
                  resourceClass: 'AnotherNotImage',
                  clipThumbnailUrl: 'anotherClipThumbnailUrl',
                  clipUrl: 'anotherClipUrl',
                  someMetadata: {
                    name: 'Format.FrameRate',
                    value: '25'
                  }
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

                it('reports canSupportCustomControls: true, framesPerSecond, in/out markers', () => {
                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                  expect(stateUpdateEmitter.calls.allArgs()).toEqual([[{
                    canSupportCustomControls: true,
                    framesPerSecond: 25,
                    inMarker: assetTest.inSeconds,
                    outMarker: assetTest.outSeconds
                  }]]);
                });

                describe('after reporting canSupportCustomControls', () => {
                  beforeEach(() => {
                    // Don't want initialization calls to affect future verifications.
                    (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();

                    if (assetTest.markers.hasOwnProperty('timeStart') && assetTest.markers.hasOwnProperty('timeEnd')) {
                      // Complete the seek caused by toggleMarkersPlayback(), which was
                      // called because we were initialized with both markers.
                      mockVideoElement.simulateSeekCompletion();
                    }
                  });

                  if (assetTest.markers.hasOwnProperty('timeStart') && assetTest.markers.hasOwnProperty('timeEnd')) {
                    it('reports playingMarkers: true, playing: true, current time', () => {
                      expect(stateUpdateEmitter.calls.allArgs())
                        .toEqual([
                          [{ playingMarkers: true }],
                          [{ playing: true }],
                          [{ currentTime: assetTest.inSeconds }]
                        ]);
                    });
                  }

                  describe('after initialization is complete', () => {
                    if (assetTest.markers.hasOwnProperty('timeStart') && assetTest.markers.hasOwnProperty('timeEnd')) {
                      beforeEach(() => {
                        // Kill initial autoplay between markers.
                        componentUnderTest.seekTo(99);

                        // Don't want initialization calls to affect future verifications.
                        (componentUnderTest.stateUpdate.emit as jasmine.Spy).calls.reset();
                      });
                    }

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

                    describe('seekToInMarker()', () => {
                      if (assetTest.markers.hasOwnProperty('timeStart')) {
                        it('reports currentTime updated to in marker', () => {
                          componentUnderTest.seekToInMarker();
                          mockVideoElement.simulateSeekCompletion();

                          expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                          expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: assetTest.inSeconds }]);
                        });
                      } else {
                        it('throws an error', () => {
                          expect(() => componentUnderTest.seekToInMarker()).toThrowError();
                        });
                      }
                    });

                    describe('seekToOutMarker()', () => {
                      if (assetTest.markers.hasOwnProperty('timeEnd')) {
                        it('reports currentTime updated to out marker', () => {
                          componentUnderTest.seekToOutMarker();
                          mockVideoElement.simulateSeekCompletion();

                          expect(stateUpdateEmitter).toHaveBeenCalledTimes(1);
                          expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: assetTest.outSeconds }]);
                        });
                      } else {
                        it('throws an error', () => {
                          expect(() => componentUnderTest.seekToOutMarker()).toThrowError();
                        });
                      }
                    });

                    describe('setInMarkerToCurrentTime()', () => {
                      it('reports inMarker update', () => {
                        mockVideoElement.simulateTimeChangeTo(0.123);
                        componentUnderTest.setInMarkerToCurrentTime();

                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 0.123 }]);
                      });

                      if (assetTest.markers.hasOwnProperty('timeEnd')) {
                        describe('if current time is greater than out marker', () => {
                          it('moves out marker, and reports inMarker and outMarker updates', () => {
                            mockVideoElement.simulateTimeChangeTo(9.876);
                            componentUnderTest.setInMarkerToCurrentTime();

                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 9.876, outMarker: 9.876 }]);
                          });
                        });
                      }
                    });

                    describe('setOutMarkerToCurrentTime()', () => {
                      it('reports outMarker update', () => {
                        mockVideoElement.simulateTimeChangeTo(5.678);
                        componentUnderTest.setOutMarkerToCurrentTime();

                        expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                        expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ outMarker: 5.678 }]);
                      });

                      if (assetTest.markers.hasOwnProperty('timeStart')) {
                        describe('if current time is less than in marker', () => {
                          it('moves in marker, and reports inMarker and outMarker updates', () => {
                            mockVideoElement.simulateTimeChangeTo(0.999);
                            componentUnderTest.setOutMarkerToCurrentTime();

                            expect(stateUpdateEmitter).toHaveBeenCalledTimes(2);
                            expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ inMarker: 0.999, outMarker: 0.999 }]);
                          });
                        });
                      }
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
                      // Icky negative if statement, so as not to bury the else case many, many lines below.
                      if (!assetTest.markers.hasOwnProperty('timeStart') || !assetTest.markers.hasOwnProperty('timeEnd')) {
                        it('throws an error', () => {
                          expect(() => componentUnderTest.toggleMarkersPlayback()).toThrowError();
                        });
                      } else {
                        [{ initialState: 'paused' }, { initialState: 'playing' }].forEach(stateTest => {
                          describe(`when playback was initially ${stateTest.initialState}`, () => {
                            let seekingEventTriggerCount: number;

                            beforeEach(() => {
                              seekingEventTriggerCount = 0;
                              mockVideoElement.on('seeking', () => seekingEventTriggerCount += 1);

                              if (stateTest.initialState === 'paused') {
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

                                if (stateTest.initialState === 'paused') {
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

                              if (stateTest.initialState === 'paused') {
                                it('reports playingMarkers: true, playing: true, current time', () => {
                                  expect(stateUpdateEmitter.calls.allArgs())
                                    .toEqual([
                                      [{ playingMarkers: true }],
                                      [{ playing: true }],
                                      [{ currentTime: assetTest.inSeconds }]
                                    ]);
                                });
                              } else {
                                it('reports playingMarkers: true, current time', () => {
                                  expect(stateUpdateEmitter.calls.allArgs())
                                    .toEqual([
                                      [{ playingMarkers: true }],
                                      [{ currentTime: assetTest.inSeconds }]
                                    ]);
                                });
                              }

                              it('is playing', () => {
                                expect(mockVideoElement.paused).toBe(false);
                              });

                              describe('when a time less than the out marker is reported', () => {
                                beforeEach(() => mockVideoElement.simulateTimeChangeTo(1.5));

                                it('reports current time', () => {
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 4 : 3);
                                  expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 1.5 }]);
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
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 4 : 3);
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
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
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
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
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
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 4 : 3);
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
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
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
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
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
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 4 : 3);
                                  expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ playingMarkers: false }]);
                                });

                                it('is still playing', () => {
                                  expect(mockVideoElement.paused).toBe(false);
                                });

                                describe('and a later time event is somehow reported', () => {
                                  beforeEach(() => mockVideoElement.simulateTimeChangeTo(6));

                                  it('reports the current time', () => {
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
                                    expect(stateUpdateEmitter.calls.mostRecent().args).toEqual([{ currentTime: 6 }]);
                                  });

                                  it('is still playing', () => {
                                    expect(mockVideoElement.paused).toBe(false);
                                  });
                                });
                              });

                              describe('when setInMarkerToCurrentTime() is called before the out marker is reached', () => {
                                const newTime: number = assetTest.outSeconds - 0.3;

                                beforeEach(() => {
                                  mockVideoElement.simulateTimeChangeTo(newTime); // happens because the player is playing
                                  componentUnderTest.setInMarkerToCurrentTime();
                                });

                                it('reports current time and inMarker update', () => {
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 5 : 4);
                                  expect(stateUpdateEmitter.calls.allArgs().slice(-2))
                                    .toEqual([
                                      [{ currentTime: newTime }],
                                      [{ inMarker: newTime }]
                                    ]);
                                });

                                it('is still playing', () => {
                                  expect(mockVideoElement.paused).toBe(false);
                                });
                              });

                              describe('when setOutMarkerToCurrentTime() is called before the out marker is reached', () => {
                                const newTime: number = assetTest.outSeconds - 0.2;

                                beforeEach(() => {
                                  mockVideoElement.simulateTimeChangeTo(newTime); // happens because the player is playing
                                  componentUnderTest.setOutMarkerToCurrentTime();
                                });

                                it('reports current time, playing: false, playingMarkers: false, outMarker update', () => {
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 7 : 6);

                                  expect(stateUpdateEmitter.calls.allArgs().slice(-4))
                                    .toEqual([
                                      [{ currentTime: newTime }],
                                      [{ playing: false }],
                                      [{ playingMarkers: false }],
                                      [{ outMarker: newTime }]
                                    ]);
                                });

                                it('is paused', () => {
                                  expect(mockVideoElement.paused).toBe(true);
                                });
                              });

                              describe('when clearMarkers() is called before the out marker is reached', () => {
                                const newTime: number = assetTest.outSeconds - 0.1;

                                beforeEach(() => {
                                  mockVideoElement.simulateTimeChangeTo(newTime); // happens because the player is playing
                                  componentUnderTest.clearMarkers();
                                });

                                it('reports current time, playingMarkers: false, outMarker update', () => {
                                  expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 6 : 5);

                                  expect(stateUpdateEmitter.calls.allArgs().slice(-3))
                                    .toEqual([
                                      [{ currentTime: newTime }],
                                      [{ playingMarkers: false }],
                                      [{ inMarker: undefined, outMarker: undefined }]
                                    ]);
                                });

                                it('is still playing', () => {
                                  expect(mockVideoElement.paused).toBe(false);
                                });
                              });

                              [
                                { condition: 'equal to', time: assetTest.outSeconds },
                                { condition: 'greater than', time: assetTest.outSeconds + 0.001 }
                              ].forEach(innerTest => {
                                describe(`as soon as a time ${innerTest.condition} the out marker is reported`, () => {
                                  beforeEach(() => mockVideoElement.simulateTimeChangeTo(innerTest.time));

                                  it('reports current time, playing: false, playingMarkers: false', () => {
                                    expect(stateUpdateEmitter).toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 6 : 5);

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
                                      expect(stateUpdateEmitter)
                                        .toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 6 : 5);
                                    });

                                    it('is still paused', () => {
                                      expect(mockVideoElement.paused).toBe(true);
                                    });

                                    describe('after \'seeked\' event is triggered', () => {
                                      beforeEach(() => mockVideoElement.simulateSeekCompletion());

                                      it('reports current time', () => {
                                        expect(stateUpdateEmitter)
                                          .toHaveBeenCalledTimes(stateTest.initialState === 'paused' ? 7 : 6);
                                        expect(stateUpdateEmitter.calls.mostRecent().args)
                                          .toEqual([{ currentTime: assetTest.outSeconds }]);
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
}
