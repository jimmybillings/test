import { AssetDetailComponent } from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
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
      componentUnderTest = new AssetDetailComponent();
      componentUnderTest.asset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets
      };
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
            expect(componentUnderTest.asset[item])
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
          componentUnderTest.ngOnChanges({ collection: { currentValue: collection } });
          expect(componentUnderTest.alreadyInCollection(123)).toBe(true);
        });
      });
    });

    describe('addToCollection()', () => {
      it('Should emit an event to add an asset to a collection with the right parameters', () => {
        spyOn(componentUnderTest.onAddToCollection, 'emit');
        componentUnderTest.addToCollection(collection, { value: 1234 }, { in: 1234, out: 1234 });
        expect(componentUnderTest.onAddToCollection.emit)
          .toHaveBeenCalledWith({ collection: collection, asset: { value: 1234, assetId: 1234 }, markers: { in: 1234, out: 1234 } });
      });
    });

    describe('removeFromCollection()', () => {
      it('Should emit an event to remove an asset from a collection with the right parameters', () => {
        spyOn(componentUnderTest.onRemoveFromCollection, 'emit');
        componentUnderTest.removeFromCollection(collection, { value: 1234 });
        expect(componentUnderTest.onRemoveFromCollection.emit)
          .toHaveBeenCalledWith({ collection: collection, asset: { value: 1234, assetId: 1234 } });
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
        componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart(1234);
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({ assetId: 1234, markers: null, selectedTranscodeTarget: 'master_copy' });
      });
    });
  });
}
