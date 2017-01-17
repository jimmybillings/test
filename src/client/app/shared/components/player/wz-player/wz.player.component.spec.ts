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
      mockPlayer.emit = (eventName: string) => {
        mockPlayer.onCallbacks[eventName].forEach((callback: Function) => {
          callback();
        });
        mockPlayer.onceCallbacks[eventName].forEach((callback: Function) => {
          callback();
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


          xit('should handleDurationEvent()', () => {
            expect(mockPlayer.once).toHaveBeenCalled();
          });
        });

        describe('playRange()', () => {
          it('should call .off() on the player with \'time\'', () => {
            componentUnderTest.playRange(1.234, 5.678);

            expect(mockPlayer.off).toHaveBeenCalledWith('time');
          });
        });
      });
    });
  });
}
