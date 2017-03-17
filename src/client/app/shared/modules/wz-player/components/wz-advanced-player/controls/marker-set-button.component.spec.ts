import { MarkerSetButtonComponent } from './marker-set-button.component';
import { SET_IN_MARKER, SET_OUT_MARKER } from '../../../interfaces/player.interface';

export function main() {
  describe('Marker Set Button Component', () => {
    let componentUnderTest: MarkerSetButtonComponent;

    beforeEach(() => {
      componentUnderTest = new MarkerSetButtonComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('For type \'in\'', () => {
      beforeEach(() => {
        componentUnderTest.type = 'in';
      });

      it('the title getter returns the expected value', () => {
        expect(componentUnderTest.title).toBe('ASSET.ADV_PLAYER.SET_IN_BTN_TITLE');
      });

      it('onClick() emits the expected event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: SET_IN_MARKER });
      });
    });

    describe('For type \'out\'', () => {
      beforeEach(() => {
        componentUnderTest.type = 'out';
      });

      it('the title getter returns the expected value', () => {
        expect(componentUnderTest.title).toBe('ASSET.ADV_PLAYER.SET_OUT_BTN_TITLE');
      });

      it('onClick() emits the expected event', () => {
        componentUnderTest.onClick();

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith({ type: SET_OUT_MARKER });
      });
    });
  });
}
