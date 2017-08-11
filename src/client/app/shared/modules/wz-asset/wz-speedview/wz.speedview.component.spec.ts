import { WzSpeedviewComponent } from './wz.speedview.component';
import { OverlayState } from '@angular/material';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Wz Speedview Component', () => {
    let componentUnderTest: WzSpeedviewComponent, mockOverlay: any, mockOverlayRef: any,
      mockConfig: OverlayState, mockRenderer: any, mockAssetService: any;

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
      mockAssetService = {
        getSpeedviewData: jasmine.createSpy('getSpeedviewData').and.returnValue(Observable.of([]))
      };
      mockRenderer = {
        listenGlobal: jasmine.createSpy('listenGlobal')
          .and.callFake((a: any, b: any, c: Function) => { c(); })
      };
      componentUnderTest = new WzSpeedviewComponent(null);
    });

    // describe('show()', () => {
    //   it('should return a promise with an instance of WzSpeedviewComponent', () => {
    //     componentUnderTest.showSpeedview({} as any).then((speedview: WzSpeedviewComponent) => {
    //       expect(speedview instanceof WzSpeedviewComponent).toBeTruthy();
    //     });
    //   });

    //   it('should configure the position correctly', () => {
    //     componentUnderTest.showSpeedview({ x: 100, y: 200 } as any).then(() => {
    //       expect(mockOverlay.position).toHaveBeenCalled();
    //       expect(mockOverlay.position.global).toHaveBeenCalled();
    //       expect(mockOverlay.position.global.top).toHaveBeenCalledWith('200px');
    //       expect(mockOverlay.position.global.top.left).toHaveBeenCalledWith('100px');
    //     });
    //   });

    //   it('should call \'attach\' on the overlayRef', () => {
    //     componentUnderTest.showSpeedview({}).then(() => {
    //       expect(mockOverlayRef.attach).toHaveBeenCalled();
    //     });
    //   });
    // });
  });
}
