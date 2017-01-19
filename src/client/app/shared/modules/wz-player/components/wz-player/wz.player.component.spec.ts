import { WzPlayerComponent } from './wz.player.component';
import { ElementRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export function main() {

  // Player Component
  // -- For an Image
  // -- For a Video
  // ---- In basic mode
  // ---- In advanced mode
  // ------ Asset Setter

  describe('Player Component', () => {
    let componentUnderTest: WzPlayerComponent, mockElementRef: ElementRef, mockZone: NgZone, mockPlayer: any;

    function JwPlayer(nativeElement: any) {
      return mockPlayer;
    }

    beforeEach(() => {
      mockElementRef = { nativeElement: { innerHtml: '', appendChild: jasmine.createSpy('appendChild') } };
      mockZone = new NgZone({});

      componentUnderTest = new WzPlayerComponent(mockElementRef, mockZone);

      mockPlayer = {};
      // Mock Player public interface
      mockPlayer.setup = jasmine.createSpy('setup');
      mockPlayer.remove = jasmine.createSpy('remove');
      mockPlayer.getState = jasmine.createSpy('getState').and.returnValue('paused');
      mockPlayer.play = jasmine.createSpy('play').and.returnValue(mockPlayer);
      mockPlayer.pause = jasmine.createSpy('pause').and.returnValue(mockPlayer);
      mockPlayer.seek = jasmine.createSpy('seek').and.callFake(() => {
        mockPlayer.emit('seeked');
        return mockPlayer;
      });

      mockPlayer.off = jasmine.createSpy('off').and.callFake((eventName: string) => {
        mockPlayer.onCallbacks[eventName] = [];
        mockPlayer.onceCallbacks[eventName] = [];
        return mockPlayer;
      });
      mockPlayer.on = jasmine.createSpy('on').and.callFake((eventName: string, callbackFn: Function) => {
        mockPlayer.onCallbacks[eventName].push(callbackFn);
        return mockPlayer;
      });
      mockPlayer.once = jasmine.createSpy('once').and.callFake((eventName: string, callbackFn: Function) => {
        mockPlayer.onceCallbacks[eventName].push(callbackFn);
        return mockPlayer;
      });

      // Mock Player private methods
      mockPlayer.onceCallbacks = {
        play: [],
        pause: [],
        complete: [],
        seeked: [],
        seek: [],
        time: []
      };
      mockPlayer.onCallbacks = {
        play: [],
        pause: [],
        complete: [],
        seeked: [],
        seek: [],
        time: []
      };
      mockPlayer.emit = (eventName: string, args?: any) => {
        mockPlayer.onCallbacks[eventName].forEach((callback: Function) => {
          callback(args);
        });
        mockPlayer.onceCallbacks[eventName].forEach((callback: Function) => {
          callback(args);
        });
        mockPlayer.onceCallbacks[eventName] = [];
      };

      componentUnderTest.window = {
        jwplayer: JwPlayer
      };
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
          expect(mockPlayer.setup).toHaveBeenCalledWith({
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
          spyOn(componentUnderTest.stateUpdate, 'emit');

          componentUnderTest.ngOnDestroy();

          expect(mockPlayer.pause).toHaveBeenCalled();
          expect(mockPlayer.remove).toHaveBeenCalled();
          expect(componentUnderTest.stateUpdate.emit).not.toHaveBeenCalled();
          expect(mockElementRef.nativeElement.innerHtml).toEqual('');
        });

        it('togglePlayback() should call .play() on the player', () => {
          componentUnderTest.togglePlayback();

          expect(mockPlayer.play).toHaveBeenCalled();
        });

        it('seekTo() should call .seek() on the player with the timeInSeconds', () => {
          componentUnderTest.seekTo(6.867);

          expect(mockPlayer.seek).toHaveBeenCalledWith(6.867);
        });

        it('playRange() should throw a new TypeError', () => {
          expect(() => { componentUnderTest.playRange(1.234, 5.678); }).toThrowError('Must be in advanced mode to play subclip.');
        });

        it('should reset the player if it already exists when a new asset is set', () => {
          componentUnderTest.asset = {
            resourceClass: 'AnotherNotImage',
            clipThumbnailUrl: 'anotherClipThumbnailUrl',
            clipUrl: 'anotherClipUrl'
          };

          expect(mockPlayer.pause).toHaveBeenCalled();
          expect(mockPlayer.remove).toHaveBeenCalled();
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
            spyOn(componentUnderTest.stateUpdate, 'emit');

            componentUnderTest.ngOnDestroy();

            expect(mockPlayer.pause).toHaveBeenCalled();
            expect(mockPlayer.remove).toHaveBeenCalled();
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: undefined, currentTime: 0 });
            expect(mockElementRef.nativeElement.innerHtml).toEqual('');
          });
        });

        describe('Asset Setter', () => {
          it('should setup the player', () => {
            expect(mockPlayer.setup).toHaveBeenCalledWith({
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
            spyOn(componentUnderTest.stateUpdate, 'emit');

            componentUnderTest.asset = {
              resourceClass: 'AnotherNotImage',
              clipThumbnailUrl: 'anotherClipThumbnailUrl',
              clipUrl: 'anotherClipUrl'
            };

            expect(mockPlayer.pause).toHaveBeenCalled();
            expect(mockPlayer.remove).toHaveBeenCalled();
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: undefined, currentTime: 0 });
          });

          it('should call handleDurationEvent which emits the stateUpdate event with the duration', () => {
            spyOn(componentUnderTest.stateUpdate, 'emit');

            mockPlayer.emit('time', { duration: 123 });

            expect(mockPlayer.once).toHaveBeenCalledWith('time', jasmine.any(Function));
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ duration: 123 });
          });

          it('should call handleTimeEvents which emits the stateUpdate event with the currentTime', () => {
            spyOn(componentUnderTest.stateUpdate, 'emit');

            mockPlayer.emit('time', { position: 456 });

            expect(mockPlayer.on).toHaveBeenCalledWith('time', jasmine.any(Function));
            expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ currentTime: 456 });
          });

          describe('handlePlaybackStateEvents()', () => {
            beforeEach(() => {
              spyOn(componentUnderTest.stateUpdate, 'emit');
            });


            it('should call .on() with \'play\'', () => {
              expect(mockPlayer.on).toHaveBeenCalledWith('play', jasmine.any(Function));
              mockPlayer.emit('play');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: true });
            });

            it('should call .on() with \'pause\'', () => {
              expect(mockPlayer.on).toHaveBeenCalledWith('pause', jasmine.any(Function));
              mockPlayer.emit('pause');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: false });
            });

            it('should call .on() with \'complete\'', () => {
              expect(mockPlayer.on).toHaveBeenCalledWith('complete', jasmine.any(Function));
              mockPlayer.emit('complete');
              expect(componentUnderTest.stateUpdate.emit).toHaveBeenCalledWith({ playing: false });
            });
          });

          describe('preventAutoplayAfterSeek()', () => {
            beforeEach(() => {
              componentUnderTest.mode = 'advanced';
              componentUnderTest.asset = {
                resourceClass: 'NotImage',
                clipThumbnailUrl: undefined,
                clipUrl: 'clipUrl'
              };
            });

            it('should call .on() with \'seek\'', () => {
              expect(mockPlayer.on).toHaveBeenCalledWith('seek', jasmine.any(Function));
            });

            it('should call .getState() on the player in the callback', () => {
              mockPlayer.emit('seek');

              expect(mockPlayer.getState).toHaveBeenCalled();
            });

            it('should call .pause() on the player if the player was paused', () => {
              mockPlayer.emit('seeked');

              expect(mockPlayer.pause).toHaveBeenCalled();
            });
          });
        });

        describe('playRange()', () => {
          it('should call .off() on the player with \'time\'', () => {
            componentUnderTest.playRange(1.234, 5.678);

            expect(mockPlayer.off).toHaveBeenCalledWith('time');
          });

          it('should call .on() on the player with \'time\'', () => {
            componentUnderTest.playRange(1.234, 5.678);

            expect(mockPlayer.on).toHaveBeenCalledWith('time', jasmine.any(Function));
          });

          it('should pause the player and remove .off handler if the position is === the endpoint', () => {
            spyOn(componentUnderTest.stateUpdate, 'emit');
            componentUnderTest.playRange(1.234, 5.678);

            mockPlayer.emit('time', { position: 5.678 });

            expect(mockPlayer.pause).toHaveBeenCalled();
            expect(mockPlayer.off).toHaveBeenCalledWith('time');
          });

          it('should not pause the player and remove .off handler if the position is > the endpoint', () => {
            spyOn(componentUnderTest.stateUpdate, 'emit');
            componentUnderTest.playRange(1.234, 5.678);

            mockPlayer.emit('time', { position: 1 });

            expect(mockPlayer.pause).toHaveBeenCalled();
            expect(mockPlayer.off).toHaveBeenCalledWith('time');
          });
        });
      });
    });
  });
}
