import { GalleryViewUrlifier } from './gallery-view-urlifier';

export function main() {
  describe('Gallery View Urlifier', () => {
    describe('urlify()', () => {
      it('returns an empty array for an undefined gallery path', () => {
        expect(GalleryViewUrlifier.urlify(undefined)).toEqual([]);
      });

      it('returns an empty array for a null gallery path', () => {
        expect(GalleryViewUrlifier.urlify(undefined)).toEqual([]);
      });

      it('returns an empty array for an empty gallery path', () => {
        expect(GalleryViewUrlifier.urlify([])).toEqual([]);
      });

      it('returns an array containing a urlified names string and a urlified ids string', () => {
        expect(GalleryViewUrlifier.urlify([{ ids: [1], names: ['Name 1'] }])).toEqual(['Name_1', '1']);
      });

      it('handles multiple levels in one path segment', () => {
        expect(GalleryViewUrlifier.urlify([{ ids: [1, 2], names: ['Name 1', 'Name 2'] }]))
          .toEqual(['Name_1~~Name_2', '1~~2']);
      });

      it('handles multiple path segments', () => {
        expect(GalleryViewUrlifier.urlify([{ ids: [1], names: ['Name 1'] }, { ids: [2], names: ['Name 2'] }]))
          .toEqual(['Name_1~~~Name_2', '1~~~2']);
      });

      it('handles multi-level path segments and multiple path segments in the same path', () => {
        expect(GalleryViewUrlifier.urlify([{ ids: [1, 2], names: ['Name 1', 'Name 2'] }, { ids: [3], names: ['Name 3'] }]))
          .toEqual(['Name_1~~Name_2~~~Name_3', '1~~2~~~3']);
      });
    });

    describe('unurlify()', () => {
      it('returns an empty path for an undefined urlified names string', () => {
        expect(GalleryViewUrlifier.unurlify(undefined, 'x')).toEqual([]);
      });

      it('returns an empty path for a null urlified names string', () => {
        expect(GalleryViewUrlifier.unurlify(null, 'x')).toEqual([]);
      });

      it('returns an empty path for an empty urlified names string', () => {
        expect(GalleryViewUrlifier.unurlify('', 'x')).toEqual([]);
      });

      it('returns an empty path for an undefined urlified ids string', () => {
        expect(GalleryViewUrlifier.unurlify('x', undefined)).toEqual([]);
      });

      it('returns an empty path for a null urlified ids string', () => {
        expect(GalleryViewUrlifier.unurlify('x', null)).toEqual([]);
      });

      it('returns an empty path for an empty urlified ids string', () => {
        expect(GalleryViewUrlifier.unurlify('x', '')).toEqual([]);
      });

      it('returns something not very useful for malformed input strings', () => {
        expect(GalleryViewUrlifier.unurlify('x', 'y')).toEqual([{ names: ['x'], ids: [NaN] }]);
      });

      it('returns a gallery path array corresponding to the inputs', () => {
        expect(GalleryViewUrlifier.unurlify('Name_1', '1')).toEqual([{ names: ['Name 1'], ids: [1] }]);
      });

      it('handles multiple levels in one path segment', () => {
        expect(GalleryViewUrlifier.unurlify('Name_1~~Name_2', '1~~2'))
          .toEqual([{ ids: [1, 2], names: ['Name 1', 'Name 2'] }]);
      });

      it('handles multiple path segments', () => {
        expect(GalleryViewUrlifier.unurlify('Name_1~~~Name_2', '1~~~2'))
          .toEqual([{ ids: [1], names: ['Name 1'] }, { ids: [2], names: ['Name 2'] }]);
      });

      it('handles multi-level path segments and multiple path segments in the same path', () => {
        expect(GalleryViewUrlifier.unurlify('Name_1~~Name_2~~~Name_3', '1~~2~~~3'))
          .toEqual([{ ids: [1, 2], names: ['Name 1', 'Name 2'] }, { ids: [3], names: ['Name 3'] }]);
      });
    });
  });
}
