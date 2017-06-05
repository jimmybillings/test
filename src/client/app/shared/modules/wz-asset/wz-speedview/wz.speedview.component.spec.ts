import { WzSpeedviewComponent } from './wz.speedview.component';
import { OverlayState } from '@angular/material';

export function main() {
  describe('Wz Speedview Component', () => {
    let componentUnderTest: WzSpeedviewComponent, mockOverlay: any, mockOverlayRef: any, mockConfig: OverlayState;

    beforeEach(() => {
      mockConfig = new OverlayState();
      mockOverlayRef = {
        attach: jasmine.createSpy('attach').and.returnValue(Promise.resolve()),
        detach: jasmine.createSpy('detach').and.returnValue(Promise.resolve()),
        dispose: jasmine.createSpy('dispose')
      };
      mockOverlay = {
        create: jasmine.createSpy('create').and.returnValue(Promise.resolve(mockOverlayRef)),
        position: jasmine.createSpy('position').and.returnValue({
          global: jasmine.createSpy('global').and.returnValue({
            top: jasmine.createSpy('top').and.returnValue({ left: jasmine.createSpy('left') })
          })
        })
      };
      componentUnderTest = new WzSpeedviewComponent(mockOverlay);
    });

    describe('show()', () => {
      it('should return a promise with an instance of WzSpeedviewComponent', () => {
        componentUnderTest.show({}).then((speedview: WzSpeedviewComponent) => {
          expect(speedview instanceof WzSpeedviewComponent).toBeTruthy();
        });
      });

      it('should configure the position correctly', () => {
        componentUnderTest.show({ x: 100, y: 200 }).then(() => {
          expect(mockOverlay.position).toHaveBeenCalled();
          expect(mockOverlay.position.global).toHaveBeenCalled();
          expect(mockOverlay.position.global.top).toHaveBeenCalledWith('200px');
          expect(mockOverlay.position.global.top.left).toHaveBeenCalledWith('100px');
        });
      });

      it('should call \'attach\' on the overlayRef', () => {
        componentUnderTest.show({}).then(() => {
          expect(mockOverlayRef.attach).toHaveBeenCalled();
        });
      });
    });
  });
}
