import { AssetDetailComponent } from './asset-detail.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
    let mockStore: MockAppStore;
    let asset: any, collection: any;
    let transcodeTargets: any, detailTypeMap: any, finalAsset: any, mockUserCan: any;

    beforeEach(() => {
      collection = { assets: { items: [{ assetId: 123 }, { assetId: 456 }, { assetId: 789 }, { assetId: 102 }, { assetId: 103 }] } };
      transcodeTargets = ['master_copy', '1080i', '1080p'];
      detailTypeMap = {
        common: ['field'], filter: true, id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core'
      };

      finalAsset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl',
        transcodeTargets: ['master_copy', '1080i', '1080p']
      };
      asset = { assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' };
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
          expect(componentUnderTest.alreadyInCollection(123)).toBe(false);
        });

        it('Should update the assetsArr if changes happen to changes.collection', () => {
          componentUnderTest.ngOnChanges({ activeCollection: { currentValue: collection } });
          expect(componentUnderTest.alreadyInCollection(123)).toBe(true);
        });
      });
    });

    describe('addAssetToActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addAsset');

        componentUnderTest.addAssetToActiveCollection();

        mockStore.expectDispatchFor(spy, componentUnderTest.asset);
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
        componentUnderTest.subclipMarkers = { 'in': {}, 'out': {} } as any;
        componentUnderTest.ngOnChanges({ asset: { assetId: 1234, currentValue: asset } });

        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({
            assetId: 1234, markers: { 'in': {}, 'out': {} }, selectedTranscodeTarget: 'master_copy'
          });
      });
    });

    describe('AddToCartBtnLabel()', () => {
      it('Should return translatable string based on on generic user and subclip markers exist.', () => {
        componentUnderTest.subclipMarkers = { 'in': {}, 'out': {} } as any;
        expect(componentUnderTest.AddToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_CART_BTN_TITLE');
      });
      it('Should return translatable string based on subclip markers exist and user is sales person.', () => {
        componentUnderTest.userCan = { administerQuotes: () => true } as any;
        componentUnderTest.subclipMarkers = { 'in': {}, 'out': {} } as any;
        expect(componentUnderTest.AddToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_QUOTE_BTN_TITLE');
      });
      it('Should return translatable string based on generic user and not a subclip.', () => {
        expect(componentUnderTest.AddToCartBtnLabel).toBe('ASSET.DETAIL.ADD_TO_CART_BTN_LABEL');
      });
      it('Should return translatable string based on sales user and subclip markers are present', () => {
        componentUnderTest.userCan = { administerQuotes: () => true } as any;
        componentUnderTest.subclipMarkers = { 'in': {}, 'out': {} } as any;
        expect(componentUnderTest.AddToCartBtnLabel).toBe('ASSET.SAVE_SUBCLIP.SAVE_TO_QUOTE_BTN_TITLE');
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
  });
}
