import { WzPlayerComponent } from './wz.player.component';
import { ElementRef, NgZone } from '@angular/core';

export function main() {
  describe('Player Component', () => {
    let componentUnderTest: WzPlayerComponent, mockElementRef: ElementRef, mockZone: NgZone;
    mockElementRef = { nativeElement: { innerHtml: '', appendChild: jasmine.createSpy('appendChild') } };
    mockZone = new NgZone({});

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

      xit('should not setup the player', () => {
        expect(componentUnderTest.window.jwplayer.setup).not.toHaveBeenCalled();
      });

      it('should have an asset getter', () => {
        expect(componentUnderTest.asset).toEqual({ resourceClass: 'Image' });
      });
    });

    describe('For a Video', () => {
      beforeEach(() => {
        componentUnderTest.asset = {
          resourceClass: 'NotImage'
        };
      });

      xit('should set up the player', () => {
        expect(componentUnderTest.window.jwplayer.setup).toHaveBeenCalled();
      });

      xdescribe('togglePlayback()', () => {
        it('should call .play() on the player', () => {
          componentUnderTest.togglePlayback();

          expect(componentUnderTest.window.jwplayer.play).toHaveBeenCalled();
        });
      });

      xdescribe('seekTo()', () => {
        it('should call .seek() on the player with the timeInSeconds', () => {
          componentUnderTest.seekTo(6.867);

          expect(componentUnderTest.window.jwplayer.seek).toHaveBeenCalledWith(6.876);
        });
      });

      xdescribe('playRange()', () => {
        it('should call .off() on the player', () => {
          componentUnderTest.playRange(1.234, 5.678);

          expect(componentUnderTest.window.jwplayer.once).toHaveBeenCalledWith('seeked');
        });
      });
    });
  });
}

class JwPlayer {
  constructor(nativeElement: any) { }
  setup() { jasmine.createSpy('setup'); }
  pause() { jasmine.createSpy('pause'); }
  play() { jasmine.createSpy('play'); }
  seek() { jasmine.createSpy('seek'); }
  once() { jasmine.createSpy('once'); }
  off() { jasmine.createSpy('off'); }
  on() { jasmine.createSpy('on'); }
}
