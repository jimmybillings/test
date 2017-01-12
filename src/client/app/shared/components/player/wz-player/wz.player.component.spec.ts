import { WzPlayerComponent } from './wz.player.component';
import { ElementRef, NgZone } from '@angular/core';

export function main() {
  describe('Player Component', () => {
    let componentUnderTest: WzPlayerComponent, mockElementRef: ElementRef, mockZone: NgZone;
    mockElementRef = { nativeElement: { innerHtml: '', appendChild: jasmine.createSpy('appendChild') } };
    mockZone = new NgZone({});

    function JwPlayer(nativeElement: any) {
      return {
        setup: jasmine.createSpy('setup'),
        play: jasmine.createSpy('play'),
        pause: jasmine.createSpy('pause'),
        off: jasmine.createSpy('off'),
        on: jasmine.createSpy('on'),
        once: jasmine.createSpy('once'),
        seek: jasmine.createSpy('seek')
      };
    }

    beforeEach(() => {
      componentUnderTest = new WzPlayerComponent(mockElementRef, mockZone);
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

        describe('seting the asset', () => {
          it('should set up the player', () => {
            expect(componentUnderTest.player.setup).toHaveBeenCalledWith({
              image: 'clipThumbnailUrl',
              file: 'clipUrl',
              logo: {
                file: 'assets/img/logo/watermark.png',
                position: 'top-right',
                link: 'http://www.wazeedigital.com'
              }
            });
          });

          xit('should handleDurationEvent()', () => {
            expect(componentUnderTest.player.once).toHaveBeenCalled();
          });
        });

        describe('togglePlayback()', () => {
          it('should call .play() on the player', () => {
            componentUnderTest.togglePlayback();

            expect(componentUnderTest.player.play).toHaveBeenCalled();
          });
        });

        describe('seekTo()', () => {
          it('should call .seek() on the player with the timeInSeconds', () => {
            componentUnderTest.seekTo(6.867);

            expect(componentUnderTest.player.seek).toHaveBeenCalledWith(6.867);
          });
        });

        xdescribe('playRange()', () => {
          it('should throw a new TypeError', () => {
            componentUnderTest.playRange(1.234, 5.678);
            expect(componentUnderTest.playRange).toThrowError('Must be in advanced mode to play subclip.');
          });
        });
      });

      // Tests where this.mode === 'advanced'
      describe('in advanced mode', () => {
        beforeEach(() => {
          componentUnderTest.mode = 'advanced';
          componentUnderTest.asset = {
            resourceClass: 'NotImage',
            clipThumbnailUrl: undefined,
            clipUrl: 'clipUrl'
          };
        });

        it('should set up the player', () => {
          expect(componentUnderTest.player.setup).toHaveBeenCalledWith({
            image: null,
            file: 'clipUrl',
            logo: {
              file: 'assets/img/logo/watermark.png',
              position: 'top-right',
              link: 'http://www.wazeedigital.com'
            }
          });
        });

        xdescribe('playRange()', () => {
          it('should call .off() on the player', () => {
            componentUnderTest.playRange(1.234, 5.678);

            expect(componentUnderTest.player.once).toHaveBeenCalledWith('seeked');
          });
        });
      });
    });
  });
}
