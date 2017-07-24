import { AssetDetailComponent } from './asset-detail.component';
import { StoreSpecHelper } from '../../store/store.spec-helper';

export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
    let storeSpecHelper: StoreSpecHelper;
    let asset: any, collection: any;
    let transcodeTargets: any, detailTypeMap: any, finalAsset: any;

    beforeEach(() => {
      collection = { assets: { items: [{ assetId: 123 }, { assetId: 456 }, { assetId: 789 }, { assetId: 102 }, { assetId: 103 }] } };
      transcodeTargets = ['master_copy', '1080i', '1080p'];
      detailTypeMap = { common: ['field'], filter: true, id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core' };

      finalAsset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', common: ['field'], filter: true,
        id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core',
        transcodeTargets: transcodeTargets
      };
      asset = { assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' };
      asset.detailTypeMap = detailTypeMap;
      asset.transcodeTargets = transcodeTargets;

      storeSpecHelper = new StoreSpecHelper();
      componentUnderTest = new AssetDetailComponent(storeSpecHelper.mockStore);

      componentUnderTest.asset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets
      } as any;

      componentUnderTest.window = window;
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

        it('Should move the properties of detailTypeMap to the root level of asset', () => {
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          for (let item in detailTypeMap) {
            expect((componentUnderTest.asset as any)[item])
              .not.toBeUndefined();
          }
        });

        it('Should delete the detailTypMap property from the asset object', () => {
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
        const spy = storeSpecHelper.createMockActionFactoryMethod(factory => factory.activeCollection, 'addAsset');

        componentUnderTest.addAssetToActiveCollection();

        storeSpecHelper.expectDispatchFor(spy, componentUnderTest.asset);
      });
    });

    describe('removeAssetFromActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const spy = storeSpecHelper.createMockActionFactoryMethod(factory => factory.activeCollection, 'removeAsset');

        componentUnderTest.removeAssetFromActiveCollection();

        storeSpecHelper.expectDispatchFor(spy, componentUnderTest.asset);
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
      it('Should emit an event to add an asset to the cart with the correct parameters', () => {
        // Gotta do both of these to set the asset as expected.
        componentUnderTest.asset = { assetId: 1234, transcodeTargets: transcodeTargets } as any;
        componentUnderTest.ngOnChanges({ asset: { assetId: 1234, currentValue: asset }, subclipMarkers: null });

        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({ assetId: 1234, markers: null, selectedTranscodeTarget: 'master_copy' });
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
