import { WzSpeedviewDirective } from './wz.speedview.directive';
import { Viewport } from '../../../interfaces/event.interface';

export function main() {
  const mockViewportWidth: number = 240;
  const mockViewportHeight: number = 180;

  describe('Hover Intent directive', () => {
    let directiveUnderTest: WzSpeedviewDirective;

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      directiveUnderTest = new WzSpeedviewDirective();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('should not calculate if the window is too small', () => {
      beforeEach(() => {
        (<any>window).innerHeight = 640;
        (<any>window).innerWidth = 400;
        spyOn(directiveUnderTest.showPreview, 'emit');
      });

      it('horizontal', () => {
        directiveUnderTest.onMouseEnter({});

        expect(directiveUnderTest.showPreview.emit).not.toHaveBeenCalled();
      });
    });

    describe('should properly determine the x and y coordinates to place the hover preview', () => {
      let mockEvent: any;

      beforeEach(() => {
        (<any>window).innerHeight = 800;
        (<any>window).innerWidth = 1440;
        spyOn(directiveUnderTest.showPreview, 'emit');
      });

      it('for an asset with room above, below, and to the right', () => {
        let viewport: Viewport = calculateViewport(100, 300);
        mockEvent = { currentTarget: { getBoundingClientRect: () => { return viewport; } } };
        directiveUnderTest.onMouseEnter(mockEvent);

        jasmine.clock().tick(340);

        let y: number = viewport.top - (300 / 3);
        expect(directiveUnderTest.showPreview.emit).toHaveBeenCalledWith({ x: 350, y: y });
      });

      it('for an asset with room above, below, but not to the right', () => {
        let viewport: Viewport = calculateViewport(1000, 300);
        mockEvent = { currentTarget: { getBoundingClientRect: () => { return viewport; } } };
        directiveUnderTest.onMouseEnter(mockEvent);

        jasmine.clock().tick(340);

        let y: number = viewport.top - (300 / 3);
        expect(directiveUnderTest.showPreview.emit).toHaveBeenCalledWith({ x: 570, y: y });
      });

      it('for an asset with no room below, but room to the right', () => {
        let viewport: Viewport = calculateViewport(100, 700);
        mockEvent = { currentTarget: { getBoundingClientRect: () => { return viewport; } } };
        directiveUnderTest.onMouseEnter(mockEvent);

        jasmine.clock().tick(340);

        expect(directiveUnderTest.showPreview.emit).toHaveBeenCalledWith({ x: 350, y: 480 });
      });

      it('for an asset with no room above, but room to the right', () => {
        let viewport: Viewport = calculateViewport(100, 0);
        mockEvent = { currentTarget: { getBoundingClientRect: () => { return viewport; } } };
        directiveUnderTest.onMouseEnter(mockEvent);

        jasmine.clock().tick(340);

        expect(directiveUnderTest.showPreview.emit).toHaveBeenCalledWith({ x: 350, y: 20 });
      });
    });

    describe('mouseLeave', () => {
      it('should emit the hidePreview event', () => {
        spyOn(directiveUnderTest.hidePreview, 'emit');
        directiveUnderTest.onMouseLeave();

        expect(directiveUnderTest.hidePreview.emit).toHaveBeenCalled();
      });
    });
  });

  function calculateViewport(x: number, y: number): Viewport {
    return {
      left: x,
      top: y,
      right: x + mockViewportWidth,
      bottom: y + mockViewportHeight,
      width: mockViewportWidth,
      height: mockViewportHeight
    };
  }
}
