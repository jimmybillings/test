import { WzSubclipControlsComponent } from './wz.subclip-controls.component';

export function main() {
  describe('Wazee Subclip Controls Component', () => {
    let componentUnderTest: WzSubclipControlsComponent;

    beforeEach(() => {
      componentUnderTest = new WzSubclipControlsComponent();

      componentUnderTest.seekRequested.emit = jasmine.createSpy('seekRequested emitter');
      componentUnderTest.playSubclipRequested.emit = jasmine.createSpy('playSubclipRequested emitter');
      componentUnderTest.markersChanged.emit = jasmine.createSpy('markersChanged emitter');
      componentUnderTest.markersCleared.emit = jasmine.createSpy('markersCleared emitter');
    });

    describe('duration setter/getter', () => {
      it('sets the object\'s duration property', () => {
        // Looks like a silly test, but this is a setter method,
        // so make sure it doesn't forget its primary purpose.
        componentUnderTest.duration = 42.123;

        expect(componentUnderTest.duration).toBe(42.123);
      });

      it('initializes the subclip markers', () => {
        componentUnderTest.duration = 85.0601;

        expect(componentUnderTest.markers).toEqual({ in: 0, out: 85.0601 });
      });

      it('doesn\'t change the subclip markers if they are already set', () => {
        componentUnderTest.markers = { in: 2, out: 7 };

        componentUnderTest.duration = 123.456;

        expect(componentUnderTest.markers).toEqual({ in: 2, out: 7 });
      });
    });

    describe('setInMarker()', () => {
      beforeEach(() => {
        componentUnderTest.markers = { in: 5, out: 10 };
        componentUnderTest.duration = 60;
      });

      it('sets only the in marker to the current time', () => {
        componentUnderTest.currentTime = 3;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markers).toEqual({ in: 3, out: 10 });
      });

      it('sets the in marker to 0 if current time < 0', () => {
        componentUnderTest.currentTime = -2;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markers).toEqual({ in: 0, out: 10 });
      });

      it('sets the in and out markers to the current time if current time > out marker', () => {
        componentUnderTest.currentTime = 12;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markers).toEqual({ in: 12, out: 12 });
      });

      it('sets the in and out markers to the duration if current time > duration', () => {
        componentUnderTest.currentTime = 62;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markers).toEqual({ in: 60, out: 60 });
      });

      it('emits a markersChanged event', () => {
        componentUnderTest.currentTime = 9;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markersChanged.emit).toHaveBeenCalledWith({ in: 9, out: 10 });
      });

      it('emits a markersCleared event if the markers end up at 0 and duration', () => {
        componentUnderTest.markers = { in: 17, out: 60 };
        componentUnderTest.currentTime = 0;

        componentUnderTest.setInMarker();

        expect(componentUnderTest.markersChanged.emit).not.toHaveBeenCalled();
        expect(componentUnderTest.markersCleared.emit).toHaveBeenCalled();
      });
    });

    describe('setOutMarker()', () => {
      beforeEach(() => {
        componentUnderTest.markers = { in: 15, out: 20 };
        componentUnderTest.duration = 70;
      });

      it('sets only the out marker to the current time', () => {
        componentUnderTest.currentTime = 28;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markers).toEqual({ in: 15, out: 28 });
      });

      it('sets the out marker to the duration if current time > duration', () => {
        componentUnderTest.currentTime = 75;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markers).toEqual({ in: 15, out: 70 });
      });

      it('sets the in and out markers to the current time if current time < in marker', () => {
        componentUnderTest.currentTime = 13;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markers).toEqual({ in: 13, out: 13 });
      });

      it('sets the in and out markers to 0 if current time < 0', () => {
        componentUnderTest.currentTime = -5;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markers).toEqual({ in: 0, out: 0 });
      });

      it('emits a markersChanged event', () => {
        componentUnderTest.currentTime = 22;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markersChanged.emit).toHaveBeenCalledWith({ in: 15, out: 22 });
      });

      it('emits a markersCleared event if the markers end up at 0 and duration', () => {
        componentUnderTest.markers = { in: 0, out: 58 };
        componentUnderTest.currentTime = 70;

        componentUnderTest.setOutMarker();

        expect(componentUnderTest.markersChanged.emit).not.toHaveBeenCalled();
        expect(componentUnderTest.markersCleared.emit).toHaveBeenCalled();
      });
    });

    describe('gotoInMarker()', () => {
      it('emits a seekRequested event with the in marker', () => {
        componentUnderTest.markers = { in: 42, out: 47 };

        componentUnderTest.gotoInMarker();

        expect(componentUnderTest.seekRequested.emit).toHaveBeenCalledWith(42);
      });
    });

    describe('gotoOutMarker()', () => {
      it('emits a seekRequested event with the out marker', () => {
        componentUnderTest.markers = { in: 52, out: 57 };

        componentUnderTest.gotoOutMarker();

        expect(componentUnderTest.seekRequested.emit).toHaveBeenCalledWith(57);
      });
    });

    describe('playInToOut()', () => {
      it('emits a playSubclipRequested event with the markers', () => {
        componentUnderTest.markers = { in: 123, out: 456 };

        componentUnderTest.playInToOut();

        expect(componentUnderTest.playSubclipRequested.emit).toHaveBeenCalledWith({ in: 123, out: 456 });
      });
    });

    describe('clear()', () => {
      it('sets the markers to 0 and duration', () => {
        componentUnderTest.duration = 1997;
        componentUnderTest.markers = { in: 7, out: 87 };

        componentUnderTest.clear();

        expect(componentUnderTest.markers).toEqual({ in: 0, out: 1997 });
      });

      it('emits a markersCleared event', () => {
        componentUnderTest.markers = { in: 13, out: 88 };

        componentUnderTest.clear();

        expect(componentUnderTest.markersCleared.emit).toHaveBeenCalled();
      });
    });
  });
}
