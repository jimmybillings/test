import { WzHoverIntentDirective } from './wz-hover-intent.directive';

export function main() {
  describe('Hover Intent directive', () => {
    let directiveUnderTest: WzHoverIntentDirective;

    beforeEach(() => {
      directiveUnderTest = new WzHoverIntentDirective(null, null);
    });

    describe('should properly determine the x and y coordinates to place the hover preview', () => {
      let mockEvent: any;

      beforeEach(() => {
        (<any>window).innerHeight = 800;
        (<any>window).innerWidth = 1440;
        spyOn(directiveUnderTest.showPreview, 'emit');
      });

      it('should calculate properly for an asset in the top left', () => {
        mockEvent = { currentTarget: { getBoundingClientRect: () => { return { bottom: 362, height: 191, left: 44, right: 303, top: 170, width: 259 }; } } };
        directiveUnderTest.onMouseEnter(mockEvent);

        expect(directiveUnderTest.showPreview.emit).toHaveBeenCalledWith({ x: 303, y: 266.5 });
      });
    });
  });
}