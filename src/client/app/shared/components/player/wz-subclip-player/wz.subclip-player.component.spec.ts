import { WzSubclipPlayerComponent } from './wz.subclip-player.component';

export function main() {
  describe('Wazee Subclip Player Component', () => {
    let componentUnderTest: WzSubclipPlayerComponent;

    beforeEach(() => {
      componentUnderTest = new WzSubclipPlayerComponent();

      componentUnderTest.subclipMarkersChanged.emit = jasmine.createSpy('subclipMarkersChanged emitter');
      componentUnderTest.subclipMarkersCleared.emit = jasmine.createSpy('subclipMarkersCleared emitter');

      componentUnderTest.subclipControls = <any>{};

      componentUnderTest.player = <any>{
        seekTo: jasmine.createSpy('seekTo'),
        playSubclip: jasmine.createSpy('playSubclip')
      };
    });

    describe('onTimeUpdate()', () => {
      it('sets the subclip controls component\'s currentTime property', () => {
        componentUnderTest.onTimeUpdate(27.453);

        expect(componentUnderTest.subclipControls.currentTime).toEqual(27.453);
      });
    });

    describe('onDurationUpdate()', () => {
      it('sets the subclip controls component\'s duration property', () => {
        componentUnderTest.onDurationUpdate(1234.56);

        expect(componentUnderTest.subclipControls.duration).toEqual(1234.56);
      });
    });

    describe('requestSeekTo()', () => {
      it('calls the player component\'s seekTo() method', () => {
        componentUnderTest.requestSeekTo(4207);

        expect(componentUnderTest.player.seekTo).toHaveBeenCalledWith(4207);
      });
    });

    describe('requestPlaySubclip()', () => {
      it('calls the player component\'s playSubclip() method', () => {
        componentUnderTest.requestPlaySubclip({ in: 83, out: 95 });

        expect(componentUnderTest.player.playSubclip).toHaveBeenCalledWith({ in: 83, out: 95 });
      });
    });

    describe('onSubclipMarkersChanged()', () => {
      it('emits a subclipMarkersChanged event with the new markers', () => {
        componentUnderTest.onSubclipMarkersChanged({ in: 100, out: 200 });

        expect(componentUnderTest.subclipMarkersChanged.emit).toHaveBeenCalledWith({ in: 100, out: 200 });
      });
    });

    describe('onSubclipMarkersCleared()', () => {
      it('emits a subclipMarkersCleared event', () => {
        componentUnderTest.onSubclipMarkersCleared();

        expect(componentUnderTest.subclipMarkersCleared.emit).toHaveBeenCalled();
      });
    });
  });
}
