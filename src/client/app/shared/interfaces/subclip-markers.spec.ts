import { Frame } from 'wazee-frame-formatter';
import { SubclipMarkers, durationFrom } from './subclip-markers';

export function main() {
  describe('Subclip Markers Helpers', () => {
    describe('durationFrom()', () => {
      it('converts markers to duration', () => {
        const markers: SubclipMarkers = { in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) };

        expect(durationFrom(markers)).toEqual({ timeStart: 1000, timeEnd: 2000 });
      });

      it('converts a missing in marker to -1', () => {
        const markers: SubclipMarkers = { out: new Frame(30).setFromFrameNumber(60) };

        expect(durationFrom(markers)).toEqual({ timeStart: -1, timeEnd: 2000 });
      });

      it('converts a missing out marker to -2', () => {
        const markers: SubclipMarkers = { in: new Frame(30).setFromFrameNumber(30) };

        expect(durationFrom(markers)).toEqual({ timeStart: 1000, timeEnd: -2 });
      });

      it('converts undefined markers to in of -1 and out of -2', () => {
        const markers: SubclipMarkers = undefined;

        expect(durationFrom(markers)).toEqual({ timeStart: -1, timeEnd: -2 });
      });
    });
  });
}
