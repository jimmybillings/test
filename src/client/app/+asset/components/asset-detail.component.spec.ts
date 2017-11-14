import { Observable } from 'rxjs/Observable';
import { AssetDetailComponent } from './asset-detail.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';
import { enhanceAsset, AssetType } from '../../shared/interfaces/enhanced-asset';
import { mockAsset } from '../../shared/mocks/mock-asset';
import { Asset } from '../../shared/interfaces/common.interface';
import { Frame } from '../../shared/modules/wazee-frame-formatter/index';


export function main() {
  describe('Asset Detail Component', () => {
    let componentUnderTest: AssetDetailComponent;
    let mockStore: MockAppStore;
    let asset: any;
    let collection: any;
    let transcodeTargets: any;
    let detailTypeMap: any;
    let finalAsset: any;

    beforeEach(() => {
      collection = {
        assets: {
          items: [
            { assetId: 1, uuid: 'ABCD', timeStart: 123, timeEnd: 1000 },
            { assetId: 1, uuid: 'EFGH', timeStart: 456, timeEnd: 1000 },
            { assetId: 1, uuid: 'IJKL', timeStart: 789, timeEnd: 1000 },
            { assetId: 1, uuid: 'MNOP', timeStart: 102, timeEnd: 1000 },
            { assetId: 1, uuid: 'QRST', timeStart: 103, timeEnd: 1000 }
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
      mockStore.createStateSection('uiConfig', {
        components: {
          global: { config: { pageSize: { value: '50' } } },
          assetSharing: { config: {} }
        }
      });
      mockStore.createStateSection('speedPreview', { 1234: { price: 100 }, 1235: {} });

      componentUnderTest = new AssetDetailComponent(mockStore);

      componentUnderTest.asset = {
        assetId: 1, clipData: [], clipThumbnailUrl: 'clipUrl.jpg', clipUrl: 'clipUrl', transcodeTargets: transcodeTargets
      } as any;

      componentUnderTest.window = window;
      componentUnderTest.subclipMarkers = undefined;
      componentUnderTest.userCan = { administerQuotes: () => false } as any;
    });

    describe('asset setter', () => {
      it('sets the component\'s asset property', () => {
        componentUnderTest.asset = asset;

        expect(componentUnderTest.asset).toEqual(asset);
      });

      it('initializes the selectedTarget property to the first target in the array', () => {
        componentUnderTest.asset = asset;

        expect(componentUnderTest.selectedTarget).toEqual('master_copy');
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
      it('dispatches the confirmation prompt', () => {
        const spy = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
        componentUnderTest.removeAssetFromActiveCollection();
        mockStore.expectDispatchFor(spy, {
          title: 'COLLECTION.REMOVE_ASSET.TITLE',
          message: 'COLLECTION.REMOVE_ASSET.MESSAGE',
          accept: 'COLLECTION.REMOVE_ASSET.ACCEPT',
          decline: 'COLLECTION.REMOVE_ASSET.DECLINE'
        }, jasmine.any(Function));
      });

      it('dispatches the correct action via the onAccept callback', () => {
        const dialogSpy: any = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
        const removeSpy: any = mockStore.createActionFactoryMethod('activeCollection', 'removeAsset');
        dialogSpy.and.callFake((_: any, onAcceptCallback: Function) => {
          dialogSpy.onAcceptCallback = onAcceptCallback;
        });
        componentUnderTest.removeAssetFromActiveCollection();
        dialogSpy.onAcceptCallback();
        mockStore.expectDispatchFor(removeSpy, componentUnderTest.asset);
      });
    });

    describe('updateAssetInActiveCollection()', () => {
      it('dispatches the expected action', () => {
        const startFrame = new Frame(25).setFromFrameNumber(1);
        const endFrame = new Frame(25).setFromFrameNumber(2);
        componentUnderTest.subclipMarkers = { in: startFrame, out: endFrame } as any;
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'updateAssetMarkers');
        componentUnderTest.updateAssetInActiveCollection();
        mockStore.expectDispatchFor(spy, componentUnderTest.asset, componentUnderTest.subclipMarkers);
      });
    });

    describe('addAssetToCart()', () => {
      it('Should emit an event to add an asset to the cart/quote without subclipping', () => {
        componentUnderTest.asset = { assetId: 1234, transcodeTargets: transcodeTargets } as any;
        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({ assetId: 1234, markers: null, selectedTranscodeTarget: 'master_copy' });
      });

      it('Should emit an event to add an asset to the cart/quote with subclipping', () => {
        componentUnderTest.asset = { assetId: 1234, transcodeTargets: transcodeTargets } as any;
        componentUnderTest.subclipMarkers = { in: {}, out: {} } as any;

        spyOn(componentUnderTest.addToCart, 'emit');
        componentUnderTest.addAssetToCart();
        expect(componentUnderTest.addToCart.emit)
          .toHaveBeenCalledWith({
            assetId: 1234, markers: { in: {}, out: {} }, selectedTranscodeTarget: 'master_copy'
          });
      });
    });

    describe('removeAssetFromCartOrQuote()', () => {
      describe('for cart', () => {
        beforeEach(() => {
          asset.type = 'cartAsset';
          componentUnderTest.asset = asset;
        });

        it('dispatches the confirmation prompt', () => {
          const spy = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
          componentUnderTest.removeAssetFromCartOrQuote();
          mockStore.expectDispatchFor(spy, {
            title: 'CART.REMOVE_ASSET.TITLE',
            message: 'CART.REMOVE_ASSET.MESSAGE',
            accept: 'CART.REMOVE_ASSET.ACCEPT',
            decline: 'CART.REMOVE_ASSET.DECLINE'
          }, jasmine.any(Function));
        });

        it('dispatches the correct action via the onAccept callback', () => {
          const dialogSpy: any = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
          const removeSpy: any = mockStore.createActionFactoryMethod('cart', 'removeAsset');
          dialogSpy.and.callFake((_: any, onAcceptCallback: Function) => {
            dialogSpy.onAcceptCallback = onAcceptCallback;
          });
          componentUnderTest.removeAssetFromCartOrQuote();
          dialogSpy.onAcceptCallback();
          mockStore.expectDispatchFor(removeSpy, componentUnderTest.asset);
        });
      });

      describe('for quote', () => {
        beforeEach(() => {
          asset.type = 'quoteEditAsset';
          componentUnderTest.asset = asset;
        });
        it('dispatches the confirmation prompt', () => {
          const spy = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
          componentUnderTest.removeAssetFromCartOrQuote();
          mockStore.expectDispatchFor(spy, {
            title: 'QUOTE.REMOVE_ASSET.TITLE',
            message: 'QUOTE.REMOVE_ASSET.MESSAGE',
            accept: 'QUOTE.REMOVE_ASSET.ACCEPT',
            decline: 'QUOTE.REMOVE_ASSET.DECLINE'
          }, jasmine.any(Function));
        });

        it('dispatches the correct action via the onAccept callback', () => {
          const dialogSpy: any = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
          const removeSpy: any = mockStore.createActionFactoryMethod('quoteEdit', 'removeAsset');
          dialogSpy.and.callFake((_: any, onAcceptCallback: Function) => {
            dialogSpy.onAcceptCallback = onAcceptCallback;
          });
          componentUnderTest.removeAssetFromCartOrQuote();
          dialogSpy.onAcceptCallback();
          mockStore.expectDispatchFor(removeSpy, componentUnderTest.asset);
        });
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

    describe('canComment getter', () => {
      it('returns false when comment form config does not exist', () => {
        expect(componentUnderTest.canComment).toBe(false);
      });

      it('returns true when comment form config does exist', () => {
        componentUnderTest.commentFormConfig = [{ some: 'item' }] as any;
        expect(componentUnderTest.canComment).toBe(true);
      });
    });

    describe('canShare getter', () => {
      const tests: { assetType: AssetType, userCanShare: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', userCanShare: true, expectedResult: false },
        { assetType: 'collectionAsset', userCanShare: true, expectedResult: false },
        { assetType: 'orderAsset', userCanShare: true, expectedResult: false },
        { assetType: 'quoteEditAsset', userCanShare: true, expectedResult: false },
        { assetType: 'quoteShowAsset', userCanShare: true, expectedResult: false },
        { assetType: 'searchAsset', userCanShare: true, expectedResult: true }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          componentUnderTest.asset = enhanceAsset({} as any, test.assetType);
          componentUnderTest.userCan = { createAccessInfo: () => test.userCanShare } as any;

          expect(componentUnderTest.canShare).toBe(test.expectedResult);
        });
      });
    });

    describe('shareButtonLabelKey getter', () => {
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

    describe('rights getter', () => {
      it('returns the value of Rights.Reproduction metadata in the asset', () => {
        componentUnderTest.asset =
          enhanceAsset({ primary: [{ name: 'Rights.Reproduction', value: 'some value' }] } as any, 'searchAsset');

        expect(componentUnderTest.rights).toEqual('some value');
      });
    });

    describe('canShowPricingAndCartActions getter', () => {
      it('returns true when the asset has Rights.Reproduction = Royalty Free', () => {
        componentUnderTest.asset =
          enhanceAsset({ primary: [{ name: 'Rights.Reproduction', value: 'Royalty Free' }] } as any, 'searchAsset');

        expect(componentUnderTest.canShowPricingAndCartActions).toBe(true);
      });

      it('returns true when the asset has Rights.Reproduction = Rights Managed', () => {
        componentUnderTest.asset =
          enhanceAsset({ primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any, 'searchAsset');

        expect(componentUnderTest.canShowPricingAndCartActions).toBe(true);
      });

      it('returns false when the asset has Rights.Reproduction = something else', () => {
        componentUnderTest.asset =
          enhanceAsset({ primary: [{ name: 'Rights.Reproduction', value: 'something else' }] } as any, 'searchAsset');

        expect(componentUnderTest.canShowPricingAndCartActions).toBe(false);
      });
    });

    describe('priceIsStartingPrice getter', () => {
      beforeEach(() => {
        componentUnderTest.asset = enhanceAsset(
          { price: 12.34, primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );
      });

      it('returns true if asset has a non-zero price AND usage price is not set AND asset is Rights Managed', () => {
        expect(componentUnderTest.priceIsStartingPrice).toBe(true);
      });

      it('returns false if asset has no price', () => {
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.priceIsStartingPrice).toBe(false);
      });

      it('returns false if asset has a zero price', () => {
        componentUnderTest.asset = enhanceAsset(
          { price: 0, primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.priceIsStartingPrice).toBe(false);
      });

      it('returns false if usage price is set', () => {
        componentUnderTest.usagePrice = 56.78;

        expect(componentUnderTest.priceIsStartingPrice).toBe(false);
      });

      it('returns false if asset is not Rights Managed', () => {
        componentUnderTest.asset = enhanceAsset(
          { price: 12.34, primary: [{ name: 'Rights.Reproduction', value: 'Not Rights Managed' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.priceIsStartingPrice).toBe(false);
      });
    });

    describe('price and hasPrice getters', () => {
      const tests = [
        { rights: 'Royalty Free', price: 12.34, usagePrice: null, expectedResult: 12.34, hasPrice: true },
        { rights: 'Royalty Free', price: null, usagePrice: null, expectedResult: null, hasPrice: false },
        { rights: 'Royalty Free', price: 0, usagePrice: null, expectedResult: null, hasPrice: false },

        { rights: 'Royalty Free', price: 12.34, usagePrice: 56.78, expectedResult: 12.34, hasPrice: true },
        { rights: 'Royalty Free', price: null, usagePrice: 56.78, expectedResult: null, hasPrice: false },
        { rights: 'Royalty Free', price: 0, usagePrice: 56.78, expectedResult: null, hasPrice: false },

        { rights: 'Rights Managed', price: 12.34, usagePrice: null, expectedResult: 12.34, hasPrice: true },
        { rights: 'Rights Managed', price: null, usagePrice: null, expectedResult: null, hasPrice: false },
        { rights: 'Rights Managed', price: 0, usagePrice: null, expectedResult: null, hasPrice: false },

        { rights: 'Rights Managed', price: 12.34, usagePrice: 56.78, expectedResult: 56.78, hasPrice: true },
        { rights: 'Rights Managed', price: null, usagePrice: 56.78, expectedResult: 56.78, hasPrice: true },
        { rights: 'Rights Managed', price: 0, usagePrice: 56.78, expectedResult: 56.78, hasPrice: true },

        { rights: null, price: 12.34, usagePrice: null, expectedResult: null, hasPrice: false },
        { rights: null, price: null, usagePrice: null, expectedResult: null, hasPrice: false },
        { rights: null, price: 0, usagePrice: null, expectedResult: null, hasPrice: false },

        { rights: null, price: 12.34, usagePrice: 56.78, expectedResult: null, hasPrice: false },
        { rights: null, price: null, usagePrice: 56.78, expectedResult: null, hasPrice: false },
        { rights: null, price: 0, usagePrice: 56.78, expectedResult: null, hasPrice: false }
      ];

      tests.forEach(test => {
        const rights: string = `${test.rights ? test.rights : 'no rights'}`;

        describe(`for a ${rights} asset`, () => {
          const price: string = (test.price === 0 || !!test.price) ? `price = ${test.price}` : 'no price';
          const usagePrice: string = test.usagePrice ? `usage price = ${test.usagePrice}` : 'no usage price';

          it(`returns ${test.expectedResult} for ${price} and ${usagePrice}`, () => {
            componentUnderTest.asset = enhanceAsset(
              { price: test.price, primary: [{ name: 'Rights.Reproduction', value: test.rights }] } as any,
              'searchAsset'
            );
            componentUnderTest.usagePrice = test.usagePrice;

            expect(componentUnderTest.price).toBe(test.expectedResult);
            expect(componentUnderTest.hasPrice).toBe(test.hasPrice);
          });
        });
      });
    });

    describe('hasNoPrice getter', () => {
      it('returns false if asset has a price', () => {
        componentUnderTest.asset = enhanceAsset({ price: 12.34 } as any, 'searchAsset');

        expect(componentUnderTest.hasNoPrice).toBe(false);
      });

      it('returns true if asset has no price', () => {
        componentUnderTest.asset = enhanceAsset({} as any, 'searchAsset');

        expect(componentUnderTest.hasNoPrice).toBe(true);
      });

      it('returns true if asset has a zero price', () => {
        componentUnderTest.asset = enhanceAsset({ price: 0 } as any, 'searchAsset');

        expect(componentUnderTest.hasNoPrice).toBe(true);
      });
    });

    describe('canPerformCartActions getter', () => {
      const tests = [
        { haveCart: true, rights: 'Royalty Free', price: 12.34, expectedResult: true },
        { haveCart: true, rights: 'Royalty Free', price: 0, expectedResult: true },
        { haveCart: true, rights: 'Royalty Free', price: null, expectedResult: true },

        { haveCart: true, rights: 'Rights Managed', price: 12.34, expectedResult: true },
        { haveCart: true, rights: 'Rights Managed', price: 0, expectedResult: false },
        { haveCart: true, rights: 'Rights Managed', price: null, expectedResult: false },

        { haveCart: true, rights: null, price: 12.34, expectedResult: false },
        { haveCart: true, rights: null, price: 0, expectedResult: false },
        { haveCart: true, rights: null, price: null, expectedResult: false },

        { haveCart: false, rights: 'Royalty Free', price: 12.34, expectedResult: false },
        { haveCart: false, rights: 'Royalty Free', price: 0, expectedResult: false },
        { haveCart: false, rights: 'Royalty Free', price: null, expectedResult: false },

        { haveCart: false, rights: 'Rights Managed', price: 12.34, expectedResult: false },
        { haveCart: false, rights: 'Rights Managed', price: 0, expectedResult: false },
        { haveCart: false, rights: 'Rights Managed', price: null, expectedResult: false },

        { haveCart: false, rights: null, price: 12.34, expectedResult: false },
        { haveCart: false, rights: null, price: 0, expectedResult: false },
        { haveCart: false, rights: null, price: null, expectedResult: false },
      ];

      tests.forEach(test => {
        const withWithout: string = test.haveCart ? 'with' : 'without';
        const rights: string = test.rights ? test.rights : 'no rights';
        const price: string = (test.price === 0 || !!test.price) ? `price = ${test.price}` : 'no price';

        it(`returns ${test.expectedResult} ${withWithout} haveCart capability and a ${rights} asset with ${price}`, () => {
          componentUnderTest.userCan = { haveCart: () => test.haveCart } as any;
          componentUnderTest.asset = enhanceAsset(
            { price: test.price, primary: [{ name: 'Rights.Reproduction', value: test.rights }] } as any,
            'searchAsset'
          );

          expect(componentUnderTest.canPerformCartActions).toBe(test.expectedResult);
        });
      });
    });

    describe('canSelectTranscodeTarget getter', () => {
      beforeEach(() => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { transcodeTargets: { some: 'targets' }, primary: [{ name: 'Rights.Reproduction', value: 'Royalty Free' }] } as any,
          'searchAsset'
        );
      });

      it('returns true for a royalty free asset with transcode targets and addToCart capability', () => {
        expect(componentUnderTest.canSelectTranscodeTarget).toBe(true);
      });

      it('returns false for a non-royalty free asset', () => {
        componentUnderTest.asset = enhanceAsset(
          { transcodeTargets: { some: 'targets' }, primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.canSelectTranscodeTarget).toBe(false);
      });

      it('returns false for an asset without transcode targets', () => {
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.canSelectTranscodeTarget).toBe(false);
      });

      it('returns false without addToCart capability', () => {
        componentUnderTest.userCan = { addToCart: () => false } as any;

        expect(componentUnderTest.canSelectTranscodeTarget).toBe(false);
      });
    });

    describe('canCalculatePrice getter', () => {
      beforeEach(() => {
        componentUnderTest.userCan = { calculatePrice: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any,
          'searchAsset'
        );
      });

      it('returns true for a rights managed asset and calculatePrice capability', () => {
        expect(componentUnderTest.canCalculatePrice).toBe(true);
      });

      it('returns false for a non-rights managed asset', () => {
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'Rights.Reproduction', value: 'Royalty Free' }] } as any,
          'searchAsset'
        );

        expect(componentUnderTest.canCalculatePrice).toBe(false);
      });

      it('returns false without calculatePrice capability', () => {
        componentUnderTest.userCan = { calculatePrice: () => false } as any;

        expect(componentUnderTest.canSelectTranscodeTarget).toBe(false);
      });
    });

    describe('canUpdateCartAsset getter', () => {
      const tests: { assetType: AssetType, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', expectedResult: true },
        { assetType: 'collectionAsset', expectedResult: false },
        { assetType: 'orderAsset', expectedResult: false },
        { assetType: 'quoteEditAsset', expectedResult: true },
        { assetType: 'quoteShowAsset', expectedResult: false },
        { assetType: 'searchAsset', expectedResult: false },
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          componentUnderTest.asset = enhanceAsset({} as any, test.assetType);

          expect(componentUnderTest.canUpdateCartAsset).toBe(test.expectedResult);
        });
      });
    });

    describe('updateCartAssetButtonLabelKey getter', () => {
      const tests: { quoteUser: boolean, markers: boolean, expectedKey: string }[] = [
        { quoteUser: false, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.ASSET.CART' },
        { quoteUser: false, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.SUBCLIP.CART' },
        { quoteUser: false, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.ASSET.CART' },
        { quoteUser: false, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.SUBCLIP.CART' },

        { quoteUser: true, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.ASSET.QUOTE' },
        { quoteUser: true, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.SUBCLIP.QUOTE' },
        { quoteUser: true, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.ASSET.QUOTE' },
        { quoteUser: true, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.UPDATE.SUBCLIP.QUOTE' }
      ];

      tests.forEach(test => {
        const description: string = `returns ${test.expectedKey}` +
          ` for a user ${test.quoteUser ? 'with' : 'without'} quote administrator capabililty and` +
          ` an asset with markers ${test.markers ? '' : 'not '}defined`;

        it(description, () => {
          componentUnderTest.userCan = { administerQuotes: () => test.quoteUser } as any;
          if (test.markers) componentUnderTest.subclipMarkers = { in: { some: 'frame' }, out: { some: 'frame' } } as any;

          expect(componentUnderTest.updateCartAssetButtonLabelKey).toBe(test.expectedKey);
        });
      });
    });

    describe('updateCartAsset()', () => {
      it('is not yet implemented', () => {
        expect(true).toBe(true);
      });
    });

    describe('canAddToCart getter', () => {
      it('returns false without addToCart capability', () => {
        componentUnderTest.userCan = { addToCart: () => false } as any;
        expect(componentUnderTest.canAddToCart).toBe(false);
      });

      it('returns false for an asset without Rights.Reproduction', () => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'some-name', value: 'some value' }] } as any, 'searchAsset'
        );
        expect(componentUnderTest.canAddToCart).toBe(false);
      });

      it('returns false for an asset with a non-acceptable Rights.Reproduction value', () => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { primary: [{ name: 'Rights.Reproduction', value: 'some value' }] } as any, 'searchAsset'
        );
        expect(componentUnderTest.canAddToCart).toBe(false);
      });

      it('returns true for an asset with a Rights.Reproduction field of "Royalty Free" that has a price', () => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { assetId: 1234, primary: [{ name: 'Rights.Reproduction', value: 'Royalty Free' }] } as any, 'searchAsset'
        );
        expect(componentUnderTest.canAddToCart).toBe(true);
      });

      it('returns true for an asset with a Rights.Reproduction field of "Rights Managed" that has a price', () => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { assetId: 1234, primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any, 'searchAsset'
        );
        expect(componentUnderTest.canAddToCart).toBe(true);
      });

      it('returns false for an asset with a Rights.Reproduction field of "Rights Managed" that does not have a price', () => {
        componentUnderTest.userCan = { addToCart: () => true } as any;
        componentUnderTest.asset = enhanceAsset(
          { assetId: 1235, primary: [{ name: 'Rights.Reproduction', value: 'Rights Managed' }] } as any, 'searchAsset'
        );
        expect(componentUnderTest.canAddToCart).toBe(false);
      });
    });

    describe('addToCartOrQuoteButtonLabelKey getter', () => {
      const tests: { quoteUser: boolean, type: AssetType, markers: boolean, expectedKey: string }[] = [
        { quoteUser: false, type: 'searchAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.ASSET.CART' },
        { quoteUser: false, type: 'searchAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.SUBCLIP.CART' },
        { quoteUser: false, type: 'cartAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD_NEW.ASSET.CART' },
        { quoteUser: false, type: 'cartAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD_NEW.SUBCLIP.CART' },
        { quoteUser: false, type: 'quoteEditAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.ASSET.CART' },
        { quoteUser: false, type: 'quoteEditAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.SUBCLIP.CART' },

        { quoteUser: true, type: 'searchAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.ASSET.QUOTE' },
        { quoteUser: true, type: 'searchAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.SUBCLIP.QUOTE' },
        { quoteUser: true, type: 'cartAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.ASSET.QUOTE' },
        { quoteUser: true, type: 'cartAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD.SUBCLIP.QUOTE' },
        { quoteUser: true, type: 'quoteEditAsset', markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.ADD_NEW.ASSET.QUOTE' },
        { quoteUser: true, type: 'quoteEditAsset', markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.ADD_NEW.SUBCLIP.QUOTE' }
      ];

      tests.forEach(test => {
        const description: string = `returns ${test.expectedKey}` +
          ` for a user ${test.quoteUser ? 'with' : 'without'} quote administrator capabililty and` +
          ` an asset with type '${test.type}' and markers ${test.markers ? '' : 'not '}defined`;

        it(description, () => {
          componentUnderTest.userCan = { administerQuotes: () => test.quoteUser } as any;
          componentUnderTest.asset = enhanceAsset({} as any, test.type);
          if (test.markers) componentUnderTest.subclipMarkers = { in: { some: 'frame' }, out: { some: 'frame' } } as any;

          expect(componentUnderTest.addToCartOrQuoteButtonLabelKey).toBe(test.expectedKey);
        });
      });
    });

    describe('removeFromCartOrQuoteButtonLabelKey getter', () => {
      const tests: { quoteUser: boolean, markers: boolean, expectedKey: string }[] = [
        { quoteUser: true, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.REMOVE.ASSET.QUOTE' },
        { quoteUser: false, markers: false, expectedKey: 'ASSET.DETAIL.BUTTON.REMOVE.ASSET.CART' },
        { quoteUser: true, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.REMOVE.SUBCLIP.QUOTE' },
        { quoteUser: false, markers: true, expectedKey: 'ASSET.DETAIL.BUTTON.REMOVE.SUBCLIP.CART' },
      ];

      tests.forEach(test => {
        const description: string = `returns ${test.expectedKey}` +
          ` for a user ${test.quoteUser ? 'with' : 'without'} quote administrator capabililty and` +
          ` an asset with markers ${test.markers ? '' : 'not '}defined`;

        it(description, () => {
          componentUnderTest.userCan = { administerQuotes: () => test.quoteUser } as any;
          if (test.markers) componentUnderTest.asset = { isSubclipped: () => test.markers } as any;
          expect(componentUnderTest.removeFromCartOrQuoteButtonLabelKey).toBe(test.expectedKey);
        });
      });
    });


    describe('canGoToSearchAssetDetails getter', () => {
      const tests: { assetType: AssetType, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', expectedResult: true },
        { assetType: 'collectionAsset', expectedResult: true },
        { assetType: 'orderAsset', expectedResult: true },
        { assetType: 'quoteEditAsset', expectedResult: true },
        { assetType: 'quoteShowAsset', expectedResult: true },
        { assetType: 'searchAsset', expectedResult: false },
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          componentUnderTest.asset = enhanceAsset({} as any, test.assetType);

          expect(componentUnderTest.canGoToSearchAssetDetails).toBe(test.expectedResult);
        });
      });
    });

    describe('goToSearchAssetDetails', () => {
      it('dispatches the expected action when subclipMarkers are not set', () => {
        const spy = mockStore.createActionFactoryMethod('router', 'goToSearchAssetDetails');

        componentUnderTest.goToSearchAssetDetails();

        mockStore.expectDispatchFor(spy, componentUnderTest.asset.assetId, undefined);
      });

      it('dispatches the expected action when subclipMarkers are set', () => {
        const spy = mockStore.createActionFactoryMethod('router', 'goToSearchAssetDetails');

        componentUnderTest.onPlayerMarkerChange({ in: { some: 'inFrame' } as any, out: { some: 'outFrame' } as any });
        componentUnderTest.goToSearchAssetDetails();

        mockStore.expectDispatchFor(
          spy,
          componentUnderTest.asset.assetId,
          { in: { some: 'inFrame' }, out: { some: 'outFrame' } }
        );
      });
    });

    describe('canAddToActiveCollection getter', () => {
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

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' if the assetId 
        is ${test.assetIdInCollection ? 'included' : 'not'} in the collection`, () => {
            componentUnderTest.activeCollection = collection;
            componentUnderTest.asset = enhanceAsset({ ...asset, assetId: test.assetIdInCollection ? 1 : 9999 }, test.assetType);

            expect(componentUnderTest.canAddToActiveCollection).toBe(test.expectedResult);
          });
      });
    });

    describe('canAddAgainToActiveCollection getter', () => {
      const tests: { assetType: AssetType, matchingSubclipMarkers: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: false, expectedResult: true },
        { assetType: 'orderAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: false, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: false, expectedResult: true },

        { assetType: 'cartAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'collectionAsset', matchingSubclipMarkers: true, expectedResult: true },
        { assetType: 'orderAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingSubclipMarkers: true, expectedResult: false },
        { assetType: 'searchAsset', matchingSubclipMarkers: true, expectedResult: true }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' when the collection has a version of that 
        asset ${test.matchingSubclipMarkers ? 'with' : 'without'} matching subclip markers`, () => {
            componentUnderTest.activeCollection = collection;
            componentUnderTest.asset = enhanceAsset(
              { ...asset, timeStart: 123, timeEnd: test.matchingSubclipMarkers ? 1000 : 9999 },
              test.assetType
            );

            expect(componentUnderTest.canAddAgainToActiveCollection).toBe(test.expectedResult);
          });
      });

      it('returns false when the collection does not have a version of that asset', () => {
        componentUnderTest.asset = enhanceAsset({ ...asset, assetId: 9999 }, 'collectionAsset');

        expect(componentUnderTest.canAddAgainToActiveCollection).toBe(false);
      });

      it('returns true if the collection does not have that asset but the type is collection & subclip markers were set', () => {
        componentUnderTest.asset = enhanceAsset({ ...asset, assetId: 9999 }, 'collectionAsset');

        const startFrame = new Frame(25).setFromFrameNumber(1);
        const endFrame = new Frame(25).setFromFrameNumber(2);
        componentUnderTest.onPlayerMarkerChange({ in: startFrame, out: endFrame });

        expect(componentUnderTest.canAddAgainToActiveCollection).toBe(true);
      });
    });

    describe('canRemoveFromActiveCollection getter', () => {
      const tests: { assetType: AssetType, matchingUuid: boolean, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', matchingUuid: true, expectedResult: false },
        { assetType: 'collectionAsset', matchingUuid: true, expectedResult: true },
        { assetType: 'orderAsset', matchingUuid: true, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingUuid: true, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingUuid: true, expectedResult: false },
        { assetType: 'searchAsset', matchingUuid: true, expectedResult: false },

        { assetType: 'cartAsset', matchingUuid: false, expectedResult: false },
        { assetType: 'collectionAsset', matchingUuid: false, expectedResult: false },
        { assetType: 'orderAsset', matchingUuid: false, expectedResult: false },
        { assetType: 'quoteEditAsset', matchingUuid: false, expectedResult: false },
        { assetType: 'quoteShowAsset', matchingUuid: false, expectedResult: false },
        { assetType: 'searchAsset', matchingUuid: false, expectedResult: false }
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' when the collection has a version of that 
        asset ${test.matchingUuid ? 'with' : 'without'} matching UUID`, () => {
            componentUnderTest.activeCollection = collection;
            componentUnderTest.asset = enhanceAsset({ ...asset, uuid: test.matchingUuid ? 'ABCD' : 'NOPE' }, test.assetType);

            expect(componentUnderTest.canRemoveFromActiveCollection).toBe(test.expectedResult);
          });
      });
    });

    describe('canUpdateInActiveCollection getter', () => {
      const tests: {
        assetType: AssetType, matchingUuid: boolean, subclipsSet: boolean, subclipsExact: boolean, expectedResult: boolean
      }[] = [
          { assetType: 'cartAsset', matchingUuid: true, subclipsSet: true, subclipsExact: false, expectedResult: false },
          { assetType: 'orderAsset', matchingUuid: true, subclipsSet: false, subclipsExact: false, expectedResult: false },
          { assetType: 'quoteEditAsset', matchingUuid: false, subclipsSet: true, subclipsExact: false, expectedResult: false },
          { assetType: 'searchAsset', matchingUuid: false, subclipsSet: false, subclipsExact: false, expectedResult: false },
          { assetType: 'collectionAsset', matchingUuid: false, subclipsSet: true, subclipsExact: false, expectedResult: false },
          { assetType: 'collectionAsset', matchingUuid: true, subclipsSet: false, subclipsExact: false, expectedResult: false },
          { assetType: 'collectionAsset', matchingUuid: true, subclipsSet: true, subclipsExact: false, expectedResult: true },
          { assetType: 'collectionAsset', matchingUuid: true, subclipsSet: true, subclipsExact: true, expectedResult: false }
        ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}' 
        when the collection has a version of that asset ${test.matchingUuid ? 'with' : 'without'} matching UUID 
        and the subclip markers ${test.subclipsSet ? 'were' : 'were not'} changed
        ${test.subclipsExact && ' to match existing asset subclips'}`, () => {
            collection.assets.items.push({ assetId: 1, timeStart: 40, timeEnd: 80 } as Asset);
            componentUnderTest.activeCollection = collection;
            componentUnderTest.subclipMarkers = test.subclipsSet ? {
              in: new Frame(25).setFromFrameNumber(1),
              out: test.subclipsExact ? new Frame(25).setFromFrameNumber(2) : new Frame(25).setFromFrameNumber(3)
            } : null;
            componentUnderTest.asset = enhanceAsset({
              ...asset,
              uuid: test.matchingUuid ? 'MNOP' : 'NOPE'
            }, test.assetType);
            componentUnderTest.showAssetSaveSubclip = test.subclipsSet;
            expect(componentUnderTest.canUpdateInActiveCollection).toBe(test.expectedResult);
          });
      });
    });


    describe('routerLinkForAssetParent()', () => {
      describe('returns the correct routerLink', () => {
        beforeEach(() => {
          componentUnderTest.ngOnInit();
        });

        it('for a collection asset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'collectionAsset', 100);

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/collections', 100, { i: 1, n: 50 }]);
        });

        it('for a quote edit asset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'quoteEditAsset');

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/active-quote']);
        });

        it('for a quote show asset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'quoteShowAsset', 999);

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/quotes', 999]);
        });

        it('for an order asset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'orderAsset', 111);

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/orders', 111]);
        });

        it('for a cart asset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'cartAsset');

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/cart']);
        });

        it('for a search asset', () => {
          componentUnderTest.searchContext = { q: 'cat', i: 1, n: 100, sortId: 10 };
          componentUnderTest.asset = enhanceAsset(mockAsset, 'searchAsset');

          expect(componentUnderTest.routerLinkForAssetParent).toEqual(['/search', { q: 'cat', i: 1, n: 100, sortId: 10 }]);
        });
      });
    });

    describe('breadcrumbLabel getter', () => {
      describe('returns the correct translatable string', () => {
        it('for a collectionAsset', () => {
          componentUnderTest.activeCollection = { ...collection, name: 'some collection' };
          componentUnderTest.asset = enhanceAsset(mockAsset, 'collectionAsset', 100);

          expect(componentUnderTest.breadcrumbLabel).toEqual(['some collection', '']);
        });

        it('for a quoteShowAsset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'quoteShowAsset', 111);

          expect(componentUnderTest.breadcrumbLabel).toEqual(['asset.detail.breadcrumb_quoteShowAsset', '111']);
        });

        it('for a orderAsset', () => {
          componentUnderTest.asset = enhanceAsset(mockAsset, 'orderAsset', 333);

          expect(componentUnderTest.breadcrumbLabel).toEqual(['asset.detail.breadcrumb_orderAsset', '333']);
        });

        describe('for any other type of asset - ', () => {
          const tests: { assetType: AssetType; expected: string[] }[] = [
            { assetType: 'searchAsset', expected: ['asset.detail.breadcrumb_searchAsset', ''] },
            { assetType: 'quoteEditAsset', expected: ['asset.detail.breadcrumb_quoteEditAsset', ''] },
            { assetType: 'cartAsset', expected: ['asset.detail.breadcrumb_cartAsset', ''] }
          ];

          tests.forEach((test: { assetType: AssetType; expected: string[] }) => {
            it(`(${test.assetType})`, () => {
              componentUnderTest.asset = enhanceAsset(mockAsset, test.assetType);

              expect(componentUnderTest.breadcrumbLabel).toEqual(test.expected);
            });
          });
        });
      });
    });

    describe('toggleCommentsVisibility()', () => {
      it('toggles the \'showComments\' boolean', () => {
        expect(componentUnderTest.showComments).toBe(undefined);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(true);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(false);
      });
    });

    describe('userCanAddComments getter', () => {
      describe('when the commentParentObject\'s objectType is \'collection\'', () => {
        beforeEach(() => {
          componentUnderTest.commentParentObject = {
            objectId: 1,
            objectType: 'collection'
          };
        });

        it('returns an observable of true if the user can edit the collection', () => {
          componentUnderTest.userCan = {
            editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(true))
          } as any;

          let result: boolean;
          componentUnderTest.userCanAddComments.take(1).subscribe(res => result = res);

          expect(result).toBe(true);
        });

        it('returns an observable of false if the user can\'t edit the collection', () => {
          componentUnderTest.userCan = {
            editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(false))
          } as any;

          let result: boolean;
          componentUnderTest.userCanAddComments.take(1).subscribe(res => result = res);

          expect(result).toBe(false);
        });
      });

      describe('when the commentParentObject\'s objectType isn\'t \'collection\'', () => {
        beforeEach(() => {
          componentUnderTest.commentParentObject = {
            objectId: 1,
            objectType: 'cart'
          };
        });

        it('returns an observable of true', () => {
          let result: boolean;

          componentUnderTest.userCanAddComments.take(1).subscribe(res => result = res);

          expect(result).toBe(true);
        });
      });
    });

    describe('commentCount getter', () => {
      it('selects the right part of the store', () => {
        mockStore.createStateSection('comment', { activeObjectType: 'lineItem', lineItem: { pagination: { totalCount: 10 } } });
        let count: number;
        componentUnderTest.commentCount.take(1).subscribe(c => count = c);
        expect(count).toBe(10);
      });
    });

    describe('updateCartAsset()', () => {
      it('emits the right event', () => {
        spyOn(componentUnderTest.updateAssetLineItem, 'emit');
        componentUnderTest.updateCartAsset();

        expect(componentUnderTest.updateAssetLineItem.emit).toHaveBeenCalled();
      });
    });

    describe('showDownloadButton()', () => {
      const tests: { assetType: AssetType, expectedResult: boolean }[] = [
        { assetType: 'cartAsset', expectedResult: true },
        { assetType: 'collectionAsset', expectedResult: true },
        { assetType: 'orderAsset', expectedResult: false },
        { assetType: 'quoteEditAsset', expectedResult: true },
        { assetType: 'quoteShowAsset', expectedResult: true },
        { assetType: 'searchAsset', expectedResult: true },
      ];

      tests.forEach(test => {
        it(`returns ${test.expectedResult} for asset type '${test.assetType}'`, () => {
          componentUnderTest.asset = enhanceAsset({} as any, test.assetType);
          expect(componentUnderTest.showDownloadButton).toBe(test.expectedResult);
        });
      });
    });

  });
}
