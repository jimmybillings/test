import { AssetDetailComponent } from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
    let asset: any, collection: any;
    let preRenderedTranscodeTargets: any, renderedTranscodeTargets: any, detailTypeMap: any, finalAsset: any;

    beforeEach(() => {
      collection = { assets: { items: [{ assetId: 123 }, { assetId: 456 }, { assetId: 789 }, { assetId: 102 }, { assetId: 103 }] } };
      preRenderedTranscodeTargets = ['master_copy', '1080i', '1080p'];
      renderedTranscodeTargets = [
        { name: 'master_copy', selected: true },
        { name: '1080i', selected: false },
        { name: '1080p', selected: false }
      ];
      detailTypeMap = { common: ['field'], filter: true, id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core' };

      finalAsset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', common: ['field'], filter: true,
        id: 13, name: 'Core Packages', primary: [], secondary: [], siteName: 'core', transcodeTargets: [{ name: 'master_copy', selected: true },
        { name: '1080i', selected: false }, { name: '1080p', selected: false }]
      };
      asset = { assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' };
      asset.detailTypeMap = detailTypeMap;
      asset.transcodeTargets = preRenderedTranscodeTargets;
      componentUnderTest = new AssetDetailComponent();
      componentUnderTest.asset = { assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' };
    });

    describe('ngOnChanges()', () => {
      describe('changes.asset', () => {
        it('Should not update the asset if changes are not on the asset property', () => {
          componentUnderTest.ngOnChanges({});
          expect(componentUnderTest.asset)
            .toEqual({ assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' });
        });

        it('Should not update the asset with new changes to the asset object does not contain the property', () => {
          asset.detailTypeMap.common = [];
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.asset)
            .toEqual({ assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl' });
        });

        it('Should update the transcode target flat array to a collection list to be used by a drop down menu', () => {
          componentUnderTest.ngOnChanges({ asset: { currentValue: asset } });
          expect(componentUnderTest.asset.transcodeTargets)
            .toEqual(renderedTranscodeTargets);
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
        componentUnderTest.addToCollection(collection, { value: 1234 });
        expect(componentUnderTest.onAddToCollection.emit)
          .toHaveBeenCalledWith({ collection: collection, asset: { value: 1234, assetId: 1234 } });
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
        componentUnderTest.asset.transcodeTargets = renderedTranscodeTargets;
        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart(1234);
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({ assetId: 1234, selectedTranscodeTarget: 'master_copy' });
      });
    });

    describe('selectTarget()', () => {
      it('Should active a new target and de-activate the others', () => {
        componentUnderTest.asset.transcodeTargets = renderedTranscodeTargets;
        expect(componentUnderTest.asset.transcodeTargets)
          .toEqual([{ name: 'master_copy', selected: true }, { name: '1080i', selected: false }, { name: '1080p', selected: false }]);
        componentUnderTest.selectTarget({ name: '1080p', selected: false });
        expect(componentUnderTest.asset.transcodeTargets)
          .toEqual([{ name: 'master_copy', selected: false }, { name: '1080i', selected: false }, { name: '1080p', selected: true }]);
      });
    });
  });
}
