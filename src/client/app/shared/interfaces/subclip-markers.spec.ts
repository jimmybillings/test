import { Frame } from 'wazee-frame-formatter';
import * as SubclipMarkers from './subclip-markers';

export function main() {
  describe('Subclip Markers Helpers', () => {
    describe('SubclipMarkers.durationFrom()', () => {
      it('converts markers to duration', () => {
        const markers: SubclipMarkers.SubclipMarkers = {
          in: new Frame(30).setFromFrameNumber(30),
          out: new Frame(30).setFromFrameNumber(60)
        };

        expect(SubclipMarkers.durationFrom(markers)).toEqual({ timeStart: 1000, timeEnd: 2000 });
      });

      it('converts a missing in marker to -1', () => {
        const markers: SubclipMarkers.SubclipMarkers = { out: new Frame(30).setFromFrameNumber(60) };

        expect(SubclipMarkers.durationFrom(markers)).toEqual({ timeStart: -1, timeEnd: 2000 });
      });

      it('converts a missing out marker to -2', () => {
        const markers: SubclipMarkers.SubclipMarkers = { in: new Frame(30).setFromFrameNumber(30) };

        expect(SubclipMarkers.durationFrom(markers)).toEqual({ timeStart: 1000, timeEnd: -2 });
      });

      it('converts undefined markers to in of -1 and out of -2', () => {
        const markers: SubclipMarkers.SubclipMarkers = undefined;

        expect(SubclipMarkers.durationFrom(markers)).toEqual({ timeStart: -1, timeEnd: -2 });
      });
    });

    describe('bothMarkersAreSet()', () => {
      it('returns true if both are set', () => {
        expect(SubclipMarkers.bothMarkersAreSet({ in: { some: 'frame' }, out: { some: 'frame' } } as any)).toBe(true);
      });

      it('returns false if out is not set', () => {
        expect(SubclipMarkers.bothMarkersAreSet({ in: { some: 'frame' }, out: undefined } as any)).toBe(false);
      });

      it('returns false if out is not set', () => {
        expect(SubclipMarkers.bothMarkersAreSet({ out: { some: 'frame' }, in: undefined } as any)).toBe(false);
      });

      it('returns false if neither are set', () => {
        expect(SubclipMarkers.bothMarkersAreSet({ out: undefined, in: undefined } as any)).toBe(false);
      });
    });

    describe('neitherMarkersAreSet()', () => {
      it('returns true if neither are set', () => {
        expect(SubclipMarkers.neitherMarkersAreSet({ in: undefined, out: undefined } as any)).toBe(true);
      });

      it('returns false if out is not set', () => {
        expect(SubclipMarkers.neitherMarkersAreSet({ in: { some: 'frame' }, out: undefined } as any)).toBe(false);
      });

      it('returns false if in is not set', () => {
        expect(SubclipMarkers.neitherMarkersAreSet({ out: { some: 'frame' }, in: undefined } as any)).toBe(false);
      });

      it('returns false if both are set', () => {
        expect(SubclipMarkers.neitherMarkersAreSet({ in: { some: 'frame' }, out: { some: 'frame' } } as any)).toBe(false);
      });
    });
  });
}
