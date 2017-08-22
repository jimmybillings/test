import { Frame } from 'wazee-frame-formatter';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';

export function main() {

  describe('timeStartFrom()', () => {
    it('converts an in marker to milliseconds', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = {
        in: new Frame(30).setFromFrameNumber(30),
        out: new Frame(30).setFromFrameNumber(60)
      };

      expect(SubclipMarkersInterface.timeStartFrom(markers)).toBe(1000);
    });

    it('converts a missing in marker to -1', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = {
        out: new Frame(30).setFromFrameNumber(60)
      };

      expect(SubclipMarkersInterface.timeStartFrom(markers)).toBe(-1);
    });

    it('converts undefined markers to -1', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = undefined;

      expect(SubclipMarkersInterface.timeStartFrom(markers)).toBe(-1);
    });
  });

  describe('timeEndFrom()', () => {
    it('converts an in marker to milliseconds', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = {
        in: new Frame(30).setFromFrameNumber(30),
        out: new Frame(30).setFromFrameNumber(60)
      };

      expect(SubclipMarkersInterface.timeEndFrom(markers)).toBe(2000);
    });

    it('converts a missing in marker to -2', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = {
        in: new Frame(30).setFromFrameNumber(30)
      };

      expect(SubclipMarkersInterface.timeEndFrom(markers)).toBe(-2);
    });

    it('converts undefined markers to -2', () => {
      const markers: SubclipMarkersInterface.SubclipMarkers = undefined;

      expect(SubclipMarkersInterface.timeEndFrom(markers)).toBe(-2);
    });
  });
}
