import { WzAsset } from './wz-asset';
import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/common.interface';


export function main() {

  describe('Wz Asset Component', () => {
    let componentUnderTest: WzAsset;
    let mockCollection: Collection;
    let mockAsset: Asset;
    beforeEach(() => {
      mockCollection = {
        name: 'testCollection', createdOn: null, lastUpdated: null, id: 1, siteName: 'test', owner: 1, assets: {
          items: [{ assetId: 1234, uuid: 'mockAssetuuid1', name: '' }, { assetId: 1235, uuid: 'mockAssetuuid2', name: '' },
          { assetId: 1236, uuid: 'mockAssetuuid3', name: '' }]
        }
      };
      mockAsset = { assetId: 1234, name: 'mockAsset' };
      componentUnderTest = new WzAsset();
    });

    describe('addToCollection()', () => {
      it('Should emit an event to add an asset to a collection', () => {
        spyOn(componentUnderTest.onAddToCollection, 'emit');
        componentUnderTest.addToCollection(mockCollection, mockAsset);
        expect(componentUnderTest.onAddToCollection.emit).toHaveBeenCalledWith(
          { collection: mockCollection, asset: mockAsset });
      });
    });

    describe('removeFromCollection()', () => {
      it('Should emit an event to remove an asset from a collection', () => {
        spyOn(componentUnderTest.onRemoveFromCollection, 'emit');
        componentUnderTest.removeFromCollection(mockCollection, mockAsset);
        expect(componentUnderTest.onRemoveFromCollection.emit).toHaveBeenCalledWith(
          { collection: mockCollection, asset: mockAsset });
      });
    });

    describe('addAssetToCart()', () => {
      it('Should set the new active asset', () => {
        spyOn(componentUnderTest, 'setAssetActiveId');
        componentUnderTest.addAssetToCart(mockAsset);
        expect(componentUnderTest.setAssetActiveId).toHaveBeenCalledWith(mockAsset);
      });

      it('Should emit an event to add an asset to the cart', () => {
        spyOn(componentUnderTest.onAddToCart, 'emit');
        componentUnderTest.addAssetToCart(mockAsset);
        expect(componentUnderTest.onAddToCart.emit).toHaveBeenCalledWith(mockAsset);
      });
    });

    describe('downloadComp()', () => {
      it('Should emit an event to download a comp', () => {
        spyOn(componentUnderTest.onDownloadComp, 'emit');
        componentUnderTest.setAssetActiveId(mockAsset);
        componentUnderTest.downloadComp('clean');
        expect(componentUnderTest.onDownloadComp.emit).toHaveBeenCalledWith(
          { 'assetId': mockAsset.assetId, 'compType': 'clean' });
      });
    });

    describe('inCollection()', () => {
      beforeEach(() => componentUnderTest.collection = mockCollection);

      it('Should return true if an asset is already in the current collection', () => {
        expect(componentUnderTest.inCollection({ assetId: 1234, uuid: 'mockAssetuuid1', name: '' })).toBe(true);
      });

      it('Should return false if an asset is not in the current collection', () => {
        expect(componentUnderTest.inCollection({ assetId: 12334, uuid: 'mockAssetuuid1', name: '' })).toBe(false);
      });
    });

    describe('durationAsFrames()', () => {
      it('Should return asset duration as frames', () => {
        expect(componentUnderTest.durationAsFrames('29.97 fps', '00:01:43')).toBe(3087);
      });
    });

    describe('formatType()', () => {

      it('Should map a format name to acronym - HD', () => {
        expect(componentUnderTest.formatType('High Definition')).toBe('hd');
      });

      it('Should map a format name to acronym - SD', () => {
        expect(componentUnderTest.formatType('Standard Definition')).toBe('sd');
      });

      it('Should map a format name to acronym - DV', () => {
        expect(componentUnderTest.formatType('Digital Video')).toBe('dv');
      });

      it('Should map a format name to acronym - HD', () => {
        expect(componentUnderTest.formatType('Bogus Definition')).toBe('hd');
      });
    });

  });
};

