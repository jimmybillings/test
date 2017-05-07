import { AssetThumbnailComponent } from './asset-thumbnail.component';
import { Frame } from 'wazee-frame-formatter';
import { AssetService } from '../../../shared/services/asset.service';
import { Asset } from '../../../shared/interfaces/commerce.interface';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

export function main() {
  describe('Asset Thumbnail Component', () => {
    let componentUnderTest: AssetThumbnailComponent;
    let mockAsset: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockAsset = { assetId: 47 };
      mockAssetService = {
        enhance: (asset: Asset): EnhancedAsset => {
          return Object.assign(new EnhancedAsset(), asset);
        }
      };

      componentUnderTest = new AssetThumbnailComponent(mockAssetService);
      componentUnderTest.asset = mockAsset;
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
        mockAsset.uuid = 'some UUID';
        mockAsset.timeStart = 1;
        mockAsset.timeEnd = 2;
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID', timeStart: 1, timeEnd: 2 });
      });

      describe('UUID', () => {
        it('gets added when it is defined', () => {
          mockAsset.uuid = 'some UUID';
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({ uuid: 'some UUID' });
        });

        it('does not get added when it is undefined', () => {
          mockAsset.uuid = undefined;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeStart', () => {
        it('gets added when it is positive', () => {
          mockAsset.timeStart = 1;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeStart: 1 });
        });

        it('gets added when it is zero', () => {
          mockAsset.timeStart = 0;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeStart: 0 });
        });

        it('does not get added when it is negative', () => {
          mockAsset.timeStart = -1;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          mockAsset.timeStart = undefined;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });

      describe('timeEnd', () => {
        it('gets added when it is positive', () => {
          mockAsset.timeEnd = 1;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeEnd: 1 });
        });

        it('gets added when it is zero', () => {
          mockAsset.timeEnd = 0;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({ timeEnd: 0 });
        });

        it('does not get added when it is negative', () => {
          mockAsset.timeEnd = -1;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });

        it('does not get added when it is undefined', () => {
          mockAsset.timeEnd = undefined;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.routerLink[2]).toEqual({});
        });
      });
    });

    describe('durationAsFrame()', () => {
      beforeEach(() => {
        mockAsset.metadata = [];
        mockAsset.metadata[2] = { name: 'Format.FrameRate', value: '29.97 fps' };
        mockAsset.metadata[5] = { name: 'Format.Duration', value: '10000' };
        componentUnderTest.asset = mockAsset;
      });

      describe('for a subclipped asset', () => {
        beforeEach(() => {
          mockAsset.timeStart = 150;
          mockAsset.timeEnd = 200;
          componentUnderTest.asset = mockAsset;
        });

        it('returns subclip duration as a Frame when sufficient data is present', () => {
          expect(componentUnderTest.durationAsFrame.frameNumber).toEqual(50);
        });

        it('returns undefined when there is no asset metadata', () => {
          delete mockAsset.metadata;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset frameRate metadata', () => {
          delete mockAsset.metadata[2];
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset frameRate metadata value', () => {
          mockAsset.metadata[2] = {};
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });
      });

      describe('for a non-subclipped asset', () => {
        beforeEach(() => {
          mockAsset.timeStart = -2;
          componentUnderTest.asset = mockAsset;
        });

        it('returns full clip duration as a Frame when the sufficient data is present', () => {
          expect(componentUnderTest.durationAsFrame.frameNumber).toEqual(300);
        });

        it('returns undefined when there is no asset metadata', () => {
          delete mockAsset.metadata;
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset frameRate metadata', () => {
          delete mockAsset.metadata[2];
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset frameRate metadata value', () => {
          mockAsset.metadata[2] = {};
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset duration metadata', () => {
          delete mockAsset.metadata[5];
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });

        it('returns undefined when there is no asset duration metadata value', () => {
          mockAsset.metadata[5] = {};
          componentUnderTest.asset = mockAsset;

          expect(componentUnderTest.durationAsFrame).toBeUndefined();
        });
      });
    });

    describe('isImage()', () => {
      beforeEach(() => {
        mockAsset.metadata = [];
        mockAsset.metadata[6] = { name: 'Resource.Class', value: 'Image' };
        componentUnderTest.asset = mockAsset;
      });

      it('returns true for an image', () => {
        expect(componentUnderTest.isImage).toBe(true);
      });

      it('returns false when there is no asset metadata', () => {
        delete mockAsset.metadata;
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when there is no asset resource class metadata', () => {
        delete mockAsset.metadata[6];
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when asset resource class metadata is undefined', () => {
        mockAsset.metadata[6] = undefined;
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when there is no asset resource class metadata name', () => {
        delete mockAsset.metadata[6].name;
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when there is no asset resource class metadata value', () => {
        delete mockAsset.metadata[6].value;
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when the asset resource class metadata name is not "Resource.Class"', () => {
        mockAsset.metadata[6].name = 'blah';
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });

      it('returns false when the asset resource class metadata value is not "Image"', () => {
        mockAsset.metadata[6].name = 'blah';
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.isImage).toBe(false);
      });
    });

    describe('thumbnailUrl()', () => {
      it('returns the asset thumbnail URL', () => {
        mockAsset.thumbnailUrl = '/some/url';
        componentUnderTest.asset = mockAsset;

        expect(componentUnderTest.thumbnailUrl).toEqual('/some/url');
      });

      it('returns undefined when the asset thumbnail URL is not defined', () => {
        expect(componentUnderTest.thumbnailUrl).toBeUndefined();
      });
    });
  });
}
