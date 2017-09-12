import { AssetDetailComponent } from './asset-detail.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';
import { enhanceAsset, AssetType } from '../../shared/interfaces/enhanced-asset';
import { Asset } from '../../shared/interfaces/common.interface';


export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
    let mockStore: MockAppStore;
    let asset: any, collection: any;
    let transcodeTargets: any, detailTypeMap: any, finalAsset: any;

    beforeEach(() => {
      collection = {
        assets: {
          items: [
            { assetId: 1, timeStart: 123, timeEnd: 1000 },
            { assetId: 1, timeStart: 456, timeEnd: 1000 },
            { assetId: 1, timeStart: 789, timeEnd: 1000 },
            { assetId: 1, timeStart: 102, timeEnd: 1000 },
            { assetId: 1, timeStart: 103, timeEnd: 1000 }
          ]
        }
      };
      transcodeTargets = ['master_copy', '1080i', '1080p'];
      detailTypeMap = {
        common: ['field'], filter: true, id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core'
      };

      finalAsset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl',
        transcodeTargets: ['master_copy', '1080i', '1080p']
      };
      asset = { assetId: 1, timeStart: 102, timeEnd: 1000, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' };
      asset.detailTypeMap = detailTypeMap;
      asset.transcodeTargets = transcodeTargets;

      mockStore = new MockAppStore();
      componentUnderTest = new AssetDetailComponent(mockStore);

      componentUnderTest.asset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets
      } as any;

      componentUnderTest.window = window;
      componentUnderTest.subclipMarkers = undefined;
      componentUnderTest.userCan = { administerQuotes: () => false } as any;
    });

    describe('ngOnChanges()', () => {
      describe('changes.asset', () => {
        it('Should not update the asset if changes are not on the asset property', () => {
          componentUnderTest.ngOnChanges({});
          expect(componentUnderTest.asset)
            .toEqual({ assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets });
        });

        it('Should not update the asset with new changes to the asset object does not contain the property', () => {
          asset.detailTypeMap.common = [];
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.asset)
            .toEqual({ assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets });
        });

        it('Should set the selectedTranscodeTarget property to the first target in the array', () => {
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.selectedTarget).toEqual('master_copy');
        });

        it('Should delete the detailTypeMap property from the asset object', () => {
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.asset.detailTypeMap)
            .toBeUndefined();
        });

        it('Should build the final asset object to be this', () => {
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.asset).toEqual(finalAsset);
        });
      });

      describe('changes.collection', () => {
        it('Should not update the assetsArr unless changes happen to the changes.collection', () => {
          componentUnderTest.ngOnChanges({});
          expect(componentUnderTest.uniqueInCollection(asset)).toBe(false);
        });

        it('Should update the assetsArr if changes happen to changes.collection', () => {
          componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
          expect(componentUnderTest.uniqueInCollection(asset)).toBe(true);
        });
      });
    });

    describe('addAssetToActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addAsset');
        componentUnderTest.addAssetToActiveCollection();
        mockStore.expectDispatchFor(spy, componentUnderTest.asset, null);
      });
      it('with subclipping defined dispatches the expected action', () => {
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addAsset');
        componentUnderTest.addAssetToActiveCollection();
        mockStore.expectDispatchFor(spy, componentUnderTest.asset, { in: {}, out: {} });
      });
    });

    describe('removeAssetFromActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'removeAsset');
        componentUnderTest.removeAssetFromActiveCollection();
        mockStore.expectDispatchFor(spy, componentUnderTest.asset);
      });
    });

    describe('downloadComp()', () => {
      it('Should emit an event to download a comp with the right parameters', () => {
        spyOn(componentUnderTest.onDownloadComp, 'emit');
        componentUnderTest.downloadComp(1234, 'master');
        expect(componentUnderTest.onDownloadComp.emit)
          .toHaveBeenCalledWith({ 'compType': 'master', 'assetId': 1234 });
      });
    });

    describe('addAssetToCart()', () => {
      it('Should emit an event to add an asset to the cart/quote without subclipping', () => {
        // Gotta do both of these to set the asset as expected.
        componentUnderTest.asset = { assetId: 1234, transcodeTargets: transcodeTargets } as any;
        componentUnderTest.ngOnChanges({ asset: { assetId: 1234, currentValue: asset } });
        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({ assetId: 1234, markers: null, selectedTranscodeTarget: 'master_copy' });
      });

      it('Should emit an event to add an asset to the cart/quote with subclipping', () => {
        // Gotta do both of these to set the asset as expected.
        componentUnderTest.asset = { assetId: 1234, transcodeTargets: transcodeTargets } as any;
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;
        componentUnderTest.ngOnChanges({ asset: { assetId: 1234, currentValue: asset } });

        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({
            assetId: 1234, markers: { in: {}, out: {} }, selectedTranscodeTarget: 'master_copy'
          });
      });
    });

    describe('addToCartBtnLabel()', () => {
      it('Should return translatable string based on on generic user and subclip markers exist.', () => {
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;
        expect(componentUnderTest.addToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_CART_BTN_TITLE');
      });
      it('Should return translatable string based on subclip markers exist and user is sales person.', () => {
        componentUnderTest.userCan = { administerQuotes: () => true } as any;
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;
        expect(componentUnderTest.addToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_QUOTE_BTN_TITLE');
      });
      it('Should return translatable string based on generic user and not a subclip.', () => {
        expect(componentUnderTest.addToCartBtnLabel).toBe('ASSET.DETAIL.ADD_TO_CART_BTN_LABEL');
      });
      it('Should return translatable string based on sales user and subclip markers are present', () => {
        componentUnderTest.userCan = { administerQuotes: () => true } as any;
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;
        expect(componentUnderTest.addToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_QUOTE_BTN_TITLE');
      });
    });

    describe('previousPage()', () => {
      it('Should emit an event to go back to the previous page', () => {
        spyOn(componentUnderTest.onPreviousPage, 'emit');
        componentUnderTest.previousPage();
        expect(componentUnderTest.onPreviousPage.emit)
          .toHaveBeenCalled();
      });
    });

    describe('hasPageHistory', () => {
      it('Should return false if the browser has not yet loaded previous page history', () => {
        expect(componentUnderTest.hasPageHistory).toBe(false);
      });

      it('Should return true if the browser has loaded previous page history', () => {
        componentUnderTest.window.history.pushState({ data: 'somedata1' }, 'test1');
        componentUnderTest.window.history.pushState({ data: 'somedata2' }, 'test2');
        componentUnderTest.window.history.pushState({ data: 'somedata3' }, 'test3');
        expect(componentUnderTest.hasPageHistory).toBe(true);
      });
    });

    describe('canCommentOn()', () => {
      const tests: { assetType: AssetType, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', expectedResult: true },
        { assetType: 'collectionAsset', expectedResult: true },
        { assetType: 'orderAsset', expectedResult: true },
        { assetType: 'quoteEditAsset', expectedResult: true },
        { assetType: 'quoteShowAsset', expectedResult: true },
        { assetType: 'searchAsset', expectedResult: false }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          expect(componentUnderTest.canCommentOn(enhanceAsset({} as any, test.assetType))).toBe(test.expectedResult);
        });
      });
    });

    describe('canShare()', () => {
      const tests: { assetType: AssetType, userCanShare: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', userCanShare: true, expectedResult: false },
        { assetType: 'collectionAsset', userCanShare: true, expectedResult: true },
        { assetType: 'orderAsset', userCanShare: true, expectedResult: false },
        { assetType: 'quoteEditAsset', userCanShare: true, expectedResult: false },
        { assetType: 'quoteShowAsset', userCanShare: true, expectedResult: false },
        { assetType: 'searchAsset', userCanShare: true, expectedResult: true }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          componentUnderTest.userCan = { createAccessInfo: () => test.userCanShare } as any;

          expect(componentUnderTest.canShare(enhanceAsset({} as any, test.assetType))).toBe(test.expectedResult);
        });
      });
    });

    describe('shareButtonLabelKey()', () => {
      const tests: { markers: any, expectedKey: string }[] = [
        { markers: undefined, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: null, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: { in: 'x' }, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: { in: 'x', out: null }, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: { out: 'y' }, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: { in: null, out: 'y' }, expectedKey: 'ASSET.DETAIL.SHARING_BTN_TITLE' },
        { markers: { in: 'x', out: 'y' }, expectedKey: 'ASSET.DETAIL.SHARING_SUBCLIP_BTN_TITLE' }
      ];

      tests.forEach(test => {
        it(`returns '${test.expectedKey}' for markers = ${test.markers}`, () => {
          componentUnderTest.subclipMarkers = test.markers;

          expect(componentUnderTest.shareButtonLabelKey).toEqual(test.expectedKey);
        });
      });
    });

    describe('inCollection()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
      });

      it('returns true when the assetId is in the collection', () => {
        expect(componentUnderTest.inCollection(asset)).toBe(true);
      });

      it('returns false when the assetId is not in the collection', () => {
        asset.assetId = 9999;
        expect(componentUnderTest.inCollection(asset)).toBe(false);
      });
    });

    describe('canBeAddedToCollection()', () => {
      const tests: { assetType: AssetType, assetIdInCollection: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', assetIdInCollection: true, expectedResult: false },
        { assetType: 'collectionAsset', assetIdInCollection: true, expectedResult: false },
        { assetType: 'orderAsset', assetIdInCollection: true, expectedResult: false },
        { assetType: 'quoteEditAsset', assetIdInCollection: true, expectedResult: false },
        { assetType: 'quoteShowAsset', assetIdInCollection: true, expectedResult: false },
        { assetType: 'searchAsset', assetIdInCollection: true, expectedResult: false },

        { assetType: 'cartAsset', assetIdInCollection: false, expectedResult: false },
        { assetType: 'collectionAsset', assetIdInCollection: false, expectedResult: true },
        { assetType: 'orderAsset', assetIdInCollection: false, expectedResult: false },
        { assetType: 'quoteEditAsset', assetIdInCollection: false, expectedResult: false },
        { assetType: 'quoteShowAsset', assetIdInCollection: false, expectedResult: false },
        { assetType: 'searchAsset', assetIdInCollection: false, expectedResult: true }
      ];

      beforeEach(() => {
        componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
      });

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' if the assetId 
        is ${test.assetIdInCollection ? 'included' : 'not'} in the collection`, () => {
            asset.assetId = test.assetIdInCollection ? 1 : 9999;
            asset.type = test.assetType;
            expect(componentUnderTest.canBeAddedToCollection(asset)).toBe(test.expectedResult);
          });
      });
    });

    describe('canBeAddedAgainToCollection()', () => {
      const tests: { assetType: AssetType, matchingSubclipMarkers: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: false, expectedResult: true },
        { assetType: 'orderAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: false, expectedResult: true },

        { assetType: 'cartAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'orderAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: true, expectedResult: false }
      ];

      beforeEach(() => {
        componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
      });

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' when the collection has a version of that 
        asset ${test.matchingSubclipMarkers ? 'with' : 'without'} matching subclip markers`, () => {
            asset.timeStart = 123;
            asset.timeEnd = test.matchingSubclipMarkers ? 1000 : 9999;
            asset.type = test.assetType;
            expect(componentUnderTest.canBeAddedAgainToCollection(asset)).toBe(test.expectedResult);
          });
      });

      it('returns false when the collection does not have a version of that asset', () => {
        asset.assetId = 9999;
        expect(componentUnderTest.canBeAddedAgainToCollection(asset)).toBe(false);
      });
    });

    describe('canBeRemovedFromCollection()', () => {
      const tests: { assetType: AssetType, matchingSubclipMarkers: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: true, expectedResult: true },
        { assetType: 'orderAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: true, expectedResult: true },

        { assetType: 'cartAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'orderAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: false, expectedResult: false }
      ];

      beforeEach(() => {
        componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
      });

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' when the collection has a version of that 
        asset ${test.matchingSubclipMarkers ? 'with' : 'without'} matching subclip markers`, () => {
            asset.timeStart = 123;
            asset.timeEnd = test.matchingSubclipMarkers ? 1000 : 9999;
            asset.type = test.assetType;
            expect(componentUnderTest.canBeRemovedFromCollection(asset)).toBe(test.expectedResult);
          });
      });

      it('returns false when the collection does not have a version of that asset', () => {
        asset.assetId = 9999;
        expect(componentUnderTest.canBeRemovedFromCollection(asset)).toBe(false);
      });
    });
  });
}
