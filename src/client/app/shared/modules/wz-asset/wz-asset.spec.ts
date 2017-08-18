import { WzAsset } from './wz-asset';
import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/common.interface';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';


export function main() {
  describe('Wz Asset Component', () => {
    let componentUnderTest: WzAsset;
    let mockStore: MockAppStore;
    let mockCollection: Collection;
    let mockAsset: Asset;
    let mockEnhancedAsset: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockCollection = {
        name: 'testCollection', createdOn: null, lastUpdated: null, id: 1, siteName: 'test', owner: 1, assets: {
          items: [{ assetId: 1234, uuid: 'mockAssetuuid1', name: '' }, { assetId: 1235, uuid: 'mockAssetuuid2', name: '' },
          { assetId: 1236, uuid: 'mockAssetuuid3', name: '' }]
        }
      };
      mockAsset = { assetId: 1234, name: 'mockAsset' };
      mockEnhancedAsset = {};
      mockAssetService = { enhance: (asset: Asset): any => mockEnhancedAsset };

      mockStore = new MockAppStore();
      mockStore.createStateElement('comment', 'counts', { 'abc-123': 3 });

      componentUnderTest = new WzAsset(mockAssetService, mockStore);
      componentUnderTest.assets = [mockAsset];
    });

    describe('assets getter', () => {
      it('returns the original input assets', () => {
        expect(componentUnderTest.assets).toEqual([mockAsset]);
      });
    });

    describe('addToActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const mockAsset: any = { some: 'asset' };
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addAsset');

        componentUnderTest.addToActiveCollection(mockAsset);

        mockStore.expectDispatchFor(spy, mockAsset);
      });
    });

    describe('removeFromActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const mockAsset: any = { some: 'asset' };
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'removeAsset');

        componentUnderTest.removeFromActiveCollection(mockAsset);

        mockStore.expectDispatchFor(spy, mockAsset);
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

    describe('removeFromCollection()', () => {
      it('Should emit an event to edit an asset', () => {
        spyOn(componentUnderTest.onEditAsset, 'emit');
        componentUnderTest.editAsset(mockAsset);
        expect(componentUnderTest.onEditAsset.emit).toHaveBeenCalledWith(mockAsset);
      });
    });

    describe('inCollection()', () => {
      beforeEach(() => componentUnderTest.activeCollection = mockCollection);

      it('Should return true if an asset is already in the current collection', () => {
        expect(componentUnderTest.inCollection({ assetId: 1234, uuid: 'mockAssetuuid1', name: '' })).toBe(true);
      });

      it('Should return false if an asset is not in the current collection', () => {
        expect(componentUnderTest.inCollection({ assetId: 12334, uuid: 'mockAssetuuid1', name: '' })).toBe(false);
      });
    });

    describe('nameOf()', () => {
      it('returns the name of the enhanced asset', () => {
        mockEnhancedAsset.name = 'some name';

        expect(componentUnderTest.nameOf(mockAsset)).toEqual('some name');
      });
    });

    describe('routerLinkFor()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        mockEnhancedAsset.routerLink = ['/some', 'id', { some: 'parameters' }];

        expect(componentUnderTest.routerLinkFor(mockAsset)).toEqual(['/some', 'id', { some: 'parameters' }]);
      });
    });

    describe('hasThumbnail()', () => {
      it('returns true if the asset has a thumbnail URL', () => {
        mockEnhancedAsset.thumbnailUrl = 'some URL';

        expect(componentUnderTest.hasThumbnail(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a thumbnail URL', () => {
        expect(componentUnderTest.hasThumbnail(mockAsset)).toBe(false);
      });
    });

    describe('thumbnailUrlFor()', () => {
      it('returns the thumbnail URL for the asset', () => {
        mockEnhancedAsset.thumbnailUrl = 'some URL';

        expect(componentUnderTest.thumbnailUrlFor(mockAsset)).toEqual('some URL');
      });
    });

    describe('hasTitle()', () => {
      it('returns true if the asset has a title', () => {
        mockEnhancedAsset.title = 'some title';

        expect(componentUnderTest.hasTitle(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a title', () => {
        expect(componentUnderTest.hasTitle(mockAsset)).toBe(false);
      });
    });

    describe('titleOf()', () => {
      it('returns the title of the asset', () => {
        mockEnhancedAsset.title = 'some title';

        expect(componentUnderTest.titleOf(mockAsset)).toEqual('some title');
      });
    });

    describe('hasFormatType()', () => {
      it('returns true if the asset has a format type', () => {
        mockEnhancedAsset.formatType = 'some format type';

        expect(componentUnderTest.hasFormatType(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a format type', () => {
        expect(componentUnderTest.hasFormatType(mockAsset)).toBe(false);
      });
    });

    describe('formatTypeOf()', () => {
      it('returns the format type for the asset', () => {
        mockEnhancedAsset.formatType = 'some format type';

        expect(componentUnderTest.formatTypeOf(mockAsset)).toEqual('some format type');
      });
    });

    describe('formatClassNameFor()', () => {
      it('returns "hd" for "High Definition"', () => {
        mockEnhancedAsset.formatType = 'High Definition';

        expect(componentUnderTest.formatClassNameFor(mockAsset)).toBe('hd');
      });

      it('returns "sd" for "Standard Definition"', () => {
        mockEnhancedAsset.formatType = 'Standard Definition';

        expect(componentUnderTest.formatClassNameFor(mockAsset)).toBe('sd');
      });

      it('returns "dv" for "Digital Video"', () => {
        mockEnhancedAsset.formatType = 'Digital Video';

        expect(componentUnderTest.formatClassNameFor(mockAsset)).toBe('dv');
      });

      it('returns "hd" for anything else', () => {
        mockEnhancedAsset.formatType = 'Bogus Definition';

        expect(componentUnderTest.formatClassNameFor(mockAsset)).toBe('hd');
      });
    });

    describe('hasDuration()', () => {
      it('returns true if the asset has a duration', () => {
        mockEnhancedAsset.subclipDurationFrame = { some: 'frame object' };

        expect(componentUnderTest.hasDuration(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a duration', () => {
        expect(componentUnderTest.hasDuration(mockAsset)).toBe(false);
      });
    });

    describe('subclipDurationFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        mockEnhancedAsset.subclipDurationFrame = { some: 'frame object' };

        expect(componentUnderTest.subclipDurationFrameFor(mockAsset)).toEqual({ some: 'frame object' });
      });
    });

    describe('isImage()', () => {
      it('returns true if the asset is an image', () => {
        mockEnhancedAsset.isImage = true;

        expect(componentUnderTest.isImage(mockAsset)).toBe(true);
      });

      it('returns false if the asset is not an image', () => {
        mockEnhancedAsset.isImage = false;

        expect(componentUnderTest.isImage(mockAsset)).toBe(false);
      });
    });

    describe('isSubclipped()', () => {
      it('returns true if the asset is subclipped', () => {
        mockEnhancedAsset.isSubclipped = true;

        expect(componentUnderTest.isSubclipped(mockAsset)).toBe(true);
      });

      it('returns false if the asset is not subclipped', () => {
        mockEnhancedAsset.isSubclipped = false;

        expect(componentUnderTest.isSubclipped(mockAsset)).toBe(false);
      });
    });

    describe('subclipSegmentStylesFor()', () => {
      it('returns styles based on the asset', () => {
        mockEnhancedAsset.inMarkerPercentage = 17;
        mockEnhancedAsset.subclipDurationPercentage = 42;

        expect(componentUnderTest.subclipSegmentStylesFor(mockAsset))
          .toEqual({ 'margin-left.%': 17, 'width.%': 42, 'min-width.px': 2 });
      });
    });

    describe('hasDescription()', () => {
      it('returns true if the asset has a description', () => {
        mockEnhancedAsset.description = 'some description';

        expect(componentUnderTest.hasDescription(mockAsset)).toBe(true);
      });

      it('returns false if the asset doesn\'t have a description', () => {
        expect(componentUnderTest.hasDescription(mockAsset)).toBe(false);
      });
    });

    describe('descriptionOf()', () => {
      it('returns the description for the asset', () => {
        mockEnhancedAsset.description = 'some description';

        expect(componentUnderTest.descriptionOf(mockAsset)).toEqual('some description');
      });
    });

    describe('inMarkerFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        mockEnhancedAsset.inMarkerFrame = { some: 'frame object' };

        expect(componentUnderTest.inMarkerFrameFor(mockAsset)).toEqual({ some: 'frame object' });
      });
    });

    describe('outMarkerFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        mockEnhancedAsset.outMarkerFrame = { some: 'frame object' };

        expect(componentUnderTest.outMarkerFrameFor(mockAsset)).toEqual({ some: 'frame object' });
      });
    });

    describe('canBePurchased()', () => {
      it('is false when asset is missing a Rights.Reproduction metadata field', () => {
        let asset: any = {
          metaData: [
            { name: 'someKey', value: 'someValue' }
          ]
        };
        expect(componentUnderTest.canBePurchased(asset)).toBe(false);
      });

      it('is false when asset has an unaccepted value in the Rights.Reproduction metadata field', () => {
        let asset: any = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'someValue2' }
          ]
        };
        expect(componentUnderTest.canBePurchased(asset)).toBe(false);
      });

      it('is true when Rights.Reproduction is Royalty Free', () => {
        let asset: any = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'Royalty Free' }
          ]
        };
        expect(componentUnderTest.canBePurchased(asset)).toBe(true);
      });

      it('is true when Rights.Reproduction is Rights Managed', () => {
        let asset: any = {
          metaData: [
            { name: 'Rights.Reproduction', value: 'Rights Managed' }
          ]
        };
        expect(componentUnderTest.canBePurchased(asset)).toBe(true);
      });
    });

    describe('commentCountFor()', () => {
      it('selects the right part of the appStore', () => {
        componentUnderTest.commentCountFor({ uuid: 'abc-123' } as any).take(1).subscribe(count => expect(count).toBe(3));
      });
    });
  });
}

