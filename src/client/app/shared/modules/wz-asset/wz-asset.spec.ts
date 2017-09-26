import { WzAsset } from './wz-asset';
import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/common.interface';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

import * as EnhancedMock from '../../interfaces/enhanced-asset';
import { mockAsset } from '../../mocks/mock-asset';

export function main() {
  describe('Wz Asset Component', () => {
    let componentUnderTest: WzAsset;
    let mockStore: MockAppStore;
    let mockCollection: Collection;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;

    beforeEach(() => {
      mockCollection = {
        name: 'testCollection', createdOn: null, lastUpdated: null, id: 1, siteName: 'test', owner: 1, assets: {
          items: [{ assetId: 1234, uuid: 'mockAssetuuid1', name: '' }, { assetId: 1235, uuid: 'mockAssetuuid2', name: '' },
          { assetId: 1236, uuid: 'mockAssetuuid3', name: '' }]
        }
      };

      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockAsset, 'searchAsset');
      mockStore = new MockAppStore();
      mockStore.createStateElement('comment', 'counts', { 'abc-123': 3 });

      componentUnderTest = new WzAsset(mockStore);
      componentUnderTest.assets = [EnhancedMock.enhanceAsset(mockAsset, 'searchAsset')];
    });

    describe('assets getter', () => {
      it('returns the original input assets', () => {
        expect(componentUnderTest.assets).toEqual([mockEnhancedAsset]);
      });
    });

    describe('addToActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const mockAsset: any = { some: 'asset' };
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addAsset');

        componentUnderTest.addToActiveCollection(mockEnhancedAsset);

        mockStore.expectDispatchFor(spy, mockEnhancedAsset);
      });
    });

    describe('removeFromActiveCollection()', () => {
      it('dispatches the confirmation prompt', () => {
        const spy = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
        componentUnderTest.removeFromActiveCollection(mockEnhancedAsset);
        mockStore.expectDispatchFor(spy, {
          title: 'COLLECTION.REMOVE_ASSET_CONFIRMATION.TITLE',
          message: 'COLLECTION.REMOVE_ASSET_CONFIRMATION.MESSAGE',
          accept: 'COLLECTION.REMOVE_ASSET_CONFIRMATION.ACCEPT',
          decline: 'COLLECTION.REMOVE_ASSET_CONFIRMATION.DECLINE'
        }, jasmine.any(Function));
      });

      it('dispatches the correct action via the onAccept callback', () => {
        const dialogSpy: any = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
        const removeSpy: any = mockStore.createActionFactoryMethod('activeCollection', 'removeAsset');
        dialogSpy.and.callFake((_: any, onAcceptCallback: Function) => {
          dialogSpy.onAcceptCallback = onAcceptCallback;
        });
        componentUnderTest.removeFromActiveCollection(mockEnhancedAsset);
        dialogSpy.onAcceptCallback();
        mockStore.expectDispatchFor(removeSpy, mockEnhancedAsset);
      });
    });

    describe('addAssetToCart()', () => {
      it('Should set the new active asset', () => {
        spyOn(componentUnderTest, 'setAssetActiveId');
        componentUnderTest.addAssetToCart(mockEnhancedAsset);
        expect(componentUnderTest.setAssetActiveId).toHaveBeenCalledWith(mockEnhancedAsset);
      });

      it('Should emit an event to add an asset to the cart', () => {
        spyOn(componentUnderTest.onAddToCart, 'emit');
        componentUnderTest.addAssetToCart(mockEnhancedAsset);
        expect(componentUnderTest.onAddToCart.emit).toHaveBeenCalledWith(mockEnhancedAsset);
      });
    });

    describe('downloadComp()', () => {
      it('Should emit an event to download a comp', () => {
        spyOn(componentUnderTest.onDownloadComp, 'emit');
        componentUnderTest.setAssetActiveId(mockEnhancedAsset);
        componentUnderTest.downloadComp('clean');
        expect(componentUnderTest.onDownloadComp.emit).toHaveBeenCalledWith(
          { 'assetId': mockAsset.assetId, 'compType': 'clean' });
      });
    });

    describe('removeFromCollection()', () => {
      it('Should emit an event to edit an asset', () => {
        spyOn(componentUnderTest.onEditAsset, 'emit');
        componentUnderTest.editAsset(mockEnhancedAsset);
        expect(componentUnderTest.onEditAsset.emit).toHaveBeenCalledWith(mockEnhancedAsset);
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
        expect(componentUnderTest.nameOf(mockEnhancedAsset)).toEqual(mockEnhancedAsset.name);
      });
    });

    describe('routerLinkFor()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        expect(componentUnderTest.routerLinkFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.routerLink);
      });
    });

    describe('hasThumbnail()', () => {
      it('returns true if the asset has a thumbnail URL', () => {

        expect(componentUnderTest.hasThumbnail(mockEnhancedAsset)).toBe(true);
      });

    });

    describe('thumbnailUrlFor()', () => {
      it('returns the thumbnail URL for the asset', () => {
        expect(componentUnderTest.thumbnailUrlFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.thumbnailUrl);
      });
    });

    describe('hasTitle()', () => {
      it('returns true if the asset has a title', () => {
        expect(componentUnderTest.hasTitle(mockEnhancedAsset)).toBe(true);
      });
    });

    describe('titleOf()', () => {
      it('returns the title of the asset', () => {
        expect(componentUnderTest.titleOf(mockEnhancedAsset)).toEqual(mockEnhancedAsset.title);
      });
    });

    describe('hasFormatType()', () => {
      it('returns true if the asset has a format type', () => {
        expect(componentUnderTest.hasFormatType(mockEnhancedAsset)).toBe(false);
      });
    });

    describe('formatTypeOf()', () => {
      it('returns the format type for the asset', () => {
        expect(componentUnderTest.formatTypeOf(mockEnhancedAsset)).toEqual(mockEnhancedAsset.formatType);
      });
    });

    describe('formatClassNameFor()', () => {

      it('returns "hd" for "High Definition"', () => {
        expect(componentUnderTest.formatClassNameFor(mockEnhancedAsset)).toBe('hd');
      });
    });

    describe('hasDuration()', () => {
      it('returns true if the asset has a duration', () => {
        expect(componentUnderTest.hasDuration(mockEnhancedAsset)).toBe(false);
      });
    });

    describe('subclipDurationFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        expect(componentUnderTest.subclipDurationFrameFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.subclipDurationFrame);
      });
    });

    describe('isImage()', () => {
      it('returns true if the asset is an image', () => {
        expect(componentUnderTest.isImage(mockEnhancedAsset)).toBe(false);
      });
    });

    describe('isSubclipped()', () => {
      it('returns true if the asset is subclipped', () => {
        expect(componentUnderTest.isSubclipped(mockEnhancedAsset)).toBe(true);
      });
    });

    describe('subclipSegmentStylesFor()', () => {
      it('returns styles based on the asset', () => {

        expect(componentUnderTest.subclipSegmentStylesFor(mockEnhancedAsset))
          .toEqual({
            'margin-left.%': mockEnhancedAsset.inMarkerPercentage,
            'width.%': mockEnhancedAsset.subclipDurationPercentage,
            'min-width.px': 2
          });
      });
    });

    describe('hasDescription()', () => {
      it('returns true if the asset has a description', () => {
        expect(componentUnderTest.hasDescription(mockEnhancedAsset)).toBe(true);
      });
    });

    describe('descriptionOf()', () => {
      it('returns the description for the asset', () => {
        expect(componentUnderTest.descriptionOf(mockEnhancedAsset)).toEqual(mockEnhancedAsset.description);
      });
    });

    describe('inMarkerFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        expect(componentUnderTest.inMarkerFrameFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.inMarkerFrame);
      });
    });

    describe('outMarkerFrameFor()', () => {
      it('returns the duration frame object for the asset', () => {
        expect(componentUnderTest.outMarkerFrameFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.outMarkerFrame);
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

    describe('canBeRemoved()', () => {
      it('Should be false if assetType IS NOT collection and the asset IS NOT in the collection', () => {
        componentUnderTest.assetType = 'search';
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeRemoved(mockEnhancedAsset)).toBe(false);
      });

      it('Should be false if assetType IS NOT collection and the asset IS in the collection', () => {
        componentUnderTest.assetType = 'search';
        mockCollection.assets.items.push(mockEnhancedAsset);
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeRemoved(mockEnhancedAsset)).toBe(false);
      });

      it('Should be false if assetType IS collection and the asset IS NOT in the collection', () => {
        componentUnderTest.assetType = 'collection';
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeRemoved(mockEnhancedAsset)).toBe(false);
      });

      it('Should be true if assetType IS collection and the asset IS in the collection', () => {
        componentUnderTest.assetType = 'collection';
        mockCollection.assets.items.push(mockEnhancedAsset);
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeRemoved(mockEnhancedAsset)).toBe(true);
      });
    });

    describe('canBeAddedAgain()', () => {
      it('Should be false if assetType IS NOT collection and the asset IS NOT in the collection', () => {
        componentUnderTest.assetType = 'search';
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeAddedAgain(mockEnhancedAsset)).toBe(false);
      });

      it('Should be true if assetType IS NOT collection and the asset IS in the collection', () => {
        componentUnderTest.assetType = 'search';
        mockCollection.assets.items.push(mockEnhancedAsset);
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeAddedAgain(mockEnhancedAsset)).toBe(true);
      });

      it('Should be false if assetType IS collection and the asset IS NOT in the collection', () => {
        componentUnderTest.assetType = 'collection';
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeAddedAgain(mockEnhancedAsset)).toBe(false);
      });

      it('Should be false if assetType IS collection and the asset IS in the collection', () => {
        componentUnderTest.assetType = 'collection';
        mockCollection.assets.items.push(mockEnhancedAsset);
        componentUnderTest.activeCollection = mockCollection;
        expect(componentUnderTest.canBeAddedAgain(mockEnhancedAsset)).toBe(false);
      });
    });




  });
}

