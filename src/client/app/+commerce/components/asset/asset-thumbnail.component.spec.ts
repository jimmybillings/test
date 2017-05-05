import { AssetThumbnailComponent } from './asset-thumbnail.component';
import { Frame } from 'wazee-frame-formatter';

export function main() {
  describe('Asset Thumbnail Component', () => {
    let componentUnderTest: AssetThumbnailComponent;

    beforeEach(() => {
      componentUnderTest = new AssetThumbnailComponent();
      componentUnderTest.asset = { assetId: 47 };
    });

    describe('routerLink()', () => {
      it('has the correct base path', () => {
        expect(componentUnderTest.routerLink[0]).toEqual('/asset');
      });

      it('adds the assetId', () => {
        expect(componentUnderTest.routerLink[1]).toEqual(47);
      });

      it('adds an empty parameters object by default', () => {
        expect(componentUnderTest.routerLink[2]).toEqual({});
      });

      it('adds a full parameters object when everything is proper', () => {
        componentUnderTest.asset.uuid = 'some UUID';
        componentUnderTest.asset.timeStart = 1;
        componentUnderTest.asset.timeEnd = 2;

        expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID', timeStart: 1, timeEnd: 2 });
      });

      describe('UUID', () => {
        it('gets added when it is defined', () => {
          componentUnderTest.asset.uuid = 'some UUID';

          expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID' });
        });

        it('does not get added when it is undefined', () => {
          componentUnderTest.asset.uuid = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeStart', () => {
        it('gets added when it is positive', () => {
          componentUnderTest.asset.timeStart = 1;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeStart: 1 });
        });

        it('BUG - does not get added when it is zero', () => {
          componentUnderTest.asset.timeStart = 0;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is negative', () => {
          componentUnderTest.asset.timeStart = -1;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          componentUnderTest.asset.timeStart = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeEnd', () => {
        it('gets added when it is positive', () => {
          componentUnderTest.asset.timeEnd = 1;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeEnd: 1 });
        });

        it('BUG - does not get added when it is zero', () => {
          componentUnderTest.asset.timeEnd = 0;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is negative', () => {
          componentUnderTest.asset.timeEnd = -1;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          componentUnderTest.asset.timeEnd = undefined;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });
    });

    describe('durationAsFrame()', () => {
      beforeEach(() => {
        componentUnderTest.asset.metadata = [];
        componentUnderTest.asset.metadata[2] = { value: '29.97 fps' };
        componentUnderTest.asset.metadata[5] = { value: '10000' };
      });

      describe('for a subclipped asset', () => {
        beforeEach(() => {
          componentUnderTest.asset.timeStart = 150;
          componentUnderTest.asset.timeEnd = 200;
        });

        it('BUG - throws when there is no asset metadata', () => {
          delete componentUnderTest.asset.metadata;

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('BUG - throws when there is no asset frameRate metadata', () => {
          delete componentUnderTest.asset.metadata[2];

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('BUG - throws when there is no asset frameRate metadata value', () => {
          componentUnderTest.asset.metadata[2] = {};

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('returns subclip duration as a Frame when the sufficient data is present', () => {
          expect(componentUnderTest.durationAsFrame.frameNumber).toEqual(50);
        });

        it('BUG - returns NaN as a Frame when the asset has no timeEnd', () => {
          delete componentUnderTest.asset.timeEnd;

          expect(componentUnderTest.durationAsFrame.frameNumber).toBeNaN();
        });
      });

      describe('for a non-subclipped asset', () => {
        beforeEach(() => {
          componentUnderTest.asset.timeStart = -2;
        });

        it('returns full clip duration as a Frame when the sufficient data is present', () => {
          expect(componentUnderTest.durationAsFrame.frameNumber).toEqual(300);
        });


        it('BUG - throws when there is no asset metadata', () => {
          delete componentUnderTest.asset.metadata;

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('BUG - throws when there is no asset frameRate metadata', () => {
          delete componentUnderTest.asset.metadata[2];

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('returns undefined when there is no asset frameRate metadata value', () => {
          componentUnderTest.asset.metadata[2] = {};

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('BUG - throws when there is no asset duration metadata', () => {
          delete componentUnderTest.asset.metadata[5];

          expect(() => componentUnderTest.durationAsFrame).toThrow();
        });

        it('BUG - returns 0 as a Frame when there is no asset duration metadata value', () => {
          componentUnderTest.asset.metadata[5] = {};

          expect(componentUnderTest.durationAsFrame.frameNumber).toEqual(0);
        });
      });
    });

    describe('isImage()', () => {
      beforeEach(() => {
        componentUnderTest.asset.metadata = [];
        componentUnderTest.asset.metadata[6] = { name: 'Resource.Class', value: 'Image' };
      });

      it('returns true for an image', () => {
        expect(componentUnderTest.isImage).toBe(true);
      });

      it('BUG - throws when there is no asset metadata', () => {
        delete componentUnderTest.asset.metadata;

        expect(() => componentUnderTest.isImage).toThrow;
      });

      it('BUG - throws when there is no asset resource class metadata', () => {
        delete componentUnderTest.asset.metadata[6];

        expect(() => componentUnderTest.isImage).toThrow;
      });

      it('BUG - returns undefined when asset resource class metadata is undefined', () => {
        componentUnderTest.asset.metadata[6] = undefined;

        expect(componentUnderTest.isImage).toBeUndefined();
      });

      it('returns false when there is no asset resource class metadata name', () => {
        delete componentUnderTest.asset.metadata[6].name;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when there is no asset resource class metadata value', () => {
        delete componentUnderTest.asset.metadata[6].value;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when the asset resource class metadata name is not "Resource.Class"', () => {
        componentUnderTest.asset.metadata[6].name = 'blah';

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when the asset resource class metadata value is not "Image"', () => {
        componentUnderTest.asset.metadata[6].name = 'blah';

        expect(componentUnderTest.isImage).toBe(false);
      });
    });

    describe('thumbnailUrl()', () => {
      it('returns the asset thumbnail URL', () => {
        componentUnderTest.asset.thumbnailUrl = '/some/url';

        expect(componentUnderTest.thumbnailUrl).toEqual('/some/url');
      });

      it('returns undefined when the asset thumbnail URL is not defined', () => {
        expect(componentUnderTest.thumbnailUrl).toBeUndefined();
      });
    });
  });
}
