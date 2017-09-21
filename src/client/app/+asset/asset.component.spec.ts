import { Observable } from 'rxjs/Observable';

import { AssetComponent } from './asset.component';
import { MockAppStore } from '../store/spec-helpers/mock-app.store';
import * as EnhancedMock from '../shared/interfaces/enhanced-asset';
import { mockAsset } from '../shared/mocks/mock-asset';
import { Frame } from 'wazee-frame-formatter';

export function main() {
  describe('Asset Component', () => {
    let mockCurrentUserService: any;
    let mockCapabilities: any;
    let mockSearchContext: any;
    let mockUiState: any;
    let mockUserPreference: any;
    let mockAssetService: any;
    let mockUiConfig: any;
    let mockCartService: any;
    let mockWindow: any;
    let mockRouter: any;
    let mockRoute: any;
    let mockDialogService: any;
    let mockTranslate: any;
    let mockSnackBar: any;
    let mockQuoteEditService: any;
    let mockPricingStore: any;
    let mockPricingService: any;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;
    let mockStore: MockAppStore;
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      mockCurrentUserService = {};
      mockCapabilities = { administerQuotes: () => false };
      mockUiState = {};
      mockUserPreference = {
        openCollectionTray: jasmine.createSpy('openCollectionTray'),
        state: { pricingPreferences: 'thePricingPreferences' },
        updatePricingPreferences: jasmine.createSpy('updatePricingPreferences')
      };
      mockAssetService = {
        downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of({})),
        state: { asset: { assetId: 123456 } },
        priceForDetails: Observable.of(100)
      };
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { pageSize: { value: 20 } } })) };
      mockCartService = { addAssetToProjectInCart: jasmine.createSpy('addAssetToProjectInCart') };
      mockWindow = { nativeWindow: { location: { href: {} }, history: { back: jasmine.createSpy('back') } } };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockRoute = { params: Observable.of({ id: '100', uuid: 'abc-123' }), snapshot: { params: { id: '100' } } };
      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of([]))
      };
      mockSnackBar = {
        open: () => { }
      };
      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({ data: 'Test data' }))
      };
      mockQuoteEditService = { addAssetToProjectInQuote: jasmine.createSpy('addAssetToProjectInQuote') };
      mockPricingStore = {
        priceForDialog: Observable.of(1000),
        priceForDetails: Observable.of(100),
        setPriceForDetails: jasmine.createSpy('setPriceForDetails'),
        state: { priceForDetails: 100, priceForDialog: 1000 }
      };
      mockPricingService = {
        getPriceFor: jasmine.createSpy('getPriceFor').and.returnValue(Observable.of({ price: 10, some: 'data' })),
        getPriceAttributes: jasmine.createSpy('getPriceAttributes').and.returnValue(Observable.of({}))
      };
      mockStore = new MockAppStore();
      componentUnderTest = new AssetComponent(
        mockCurrentUserService, mockCapabilities, mockUiState,
        mockAssetService, mockUiConfig, mockWindow, mockRouter, mockRoute, mockStore, mockUserPreference, mockCartService,
        mockSnackBar, mockTranslate, mockDialogService, mockQuoteEditService, mockPricingStore, mockPricingService,
        null
      );
    });

    describe('stateMapper setter', () => {
      beforeEach(() => {
        mockStore.createStateSection('activeCollectionAsset', { activeAsset: mockAsset });
        componentUnderTest.assetType = 'collectionAsset';
      });

      it('sets up an asset instance variable', () => {
        componentUnderTest.stateMapper = (factory) => factory.activeCollectionAsset.activeAsset;
        const expectedAsset: EnhancedMock.EnhancedAsset = EnhancedMock.enhanceAsset(mockAsset, 'collectionAsset', 100);
        expect(componentUnderTest.asset).toEqual(expectedAsset);
      });
    });

    describe('ngOnInit()', () => {
      it('Should call the config service to get global configurations', () => {
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.get).toHaveBeenCalledWith('global');
      });

      describe('sets up the commentParentObject', () => {
        it('for a collection asset', () => {
          componentUnderTest.assetType = 'collectionAsset';
          componentUnderTest.ngOnInit();

          expect(componentUnderTest.commentParentObject).toEqual({
            objectId: 100,
            objectType: 'collection',
            nestedObjectId: 'abc-123',
            nestedObjectType: 'lineItem'
          });
        });

        it('for a quoteEditAsset', () => {
          mockStore.createStateSection('quoteEdit', { data: { id: 100 } });
          componentUnderTest.assetType = 'quoteEditAsset';
          componentUnderTest.ngOnInit();

          expect(componentUnderTest.commentParentObject).toEqual({
            objectId: 100,
            objectType: 'quote',
            nestedObjectId: 'abc-123',
            nestedObjectType: 'lineItem'
          });
        });

        it('for a quoteShowAsset', () => {
          componentUnderTest.assetType = 'quoteShowAsset';
          componentUnderTest.ngOnInit();

          expect(componentUnderTest.commentParentObject).toEqual({
            objectId: 100,
            objectType: 'quote',
            nestedObjectId: 'abc-123',
            nestedObjectType: 'lineItem'
          });
        });

        it('for a cart asset', () => {
          componentUnderTest.assetType = 'cartAsset';
          componentUnderTest.ngOnInit();

          expect(componentUnderTest.commentParentObject).toEqual({
            objectId: 100,
            objectType: 'cart',
            nestedObjectId: 'abc-123',
            nestedObjectType: 'lineItem'
          });
        });
      });
    });

    describe('downloadComp()', () => {
      let errorSpy: jasmine.Spy;

      beforeEach(() => {
        errorSpy = mockStore.createActionFactoryMethod('error', 'handleCustomError');
      });

      it('Should call the service with the correct params to download a comp', () => {
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockAssetService.downloadComp).toHaveBeenCalledWith('123123', 'New Comp');
      });

      it('Should show a notification if the server reponds that no comp is available', () => {
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        mockStore.expectDispatchFor(errorSpy, 'COMPS.NO_COMP');
      });

      it('Should set window.href.url to the location of the comp url if the server responds with a downloadable comp url', () => {
        mockAssetService = {
          downloadComp: jasmine.createSpy('downloadComp').and.returnValue(
            Observable.of({ url: 'http://downloadcomp.url' }))
        };
        componentUnderTest = new AssetComponent(
          mockCurrentUserService, mockCapabilities, mockUiState,
          mockAssetService, mockUiConfig, mockWindow, mockRouter, mockRoute, mockStore, mockUserPreference, mockCartService,
          mockSnackBar, mockTranslate, mockDialogService, mockQuoteEditService, mockPricingStore, mockPricingService,
          null
        );
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockWindow.nativeWindow.location.href).toEqual('http://downloadcomp.url');
      });
    });

    describe('addAssetToCart()', () => {
      describe('Should call the cart summary service with the correct params', () => {
        it('with a price', () => {
          componentUnderTest.addAssetToCart({ assetId: 123123, selectedTranscodeTarget: 'Target' });
          expect(mockCartService.addAssetToProjectInCart).toHaveBeenCalledWith({
            lineItem: {
              selectedTranscodeTarget: 'Target',
              price: 100,
              asset: { assetId: 123123 }
            },
            markers: undefined,
            attributes: undefined
          });
        });

        it('with asset markers', () => {
          componentUnderTest.addAssetToCart({
            assetId: 123123, selectedTranscodeTarget: 'Target', markers: { some: 'markers' }
          });
          expect(mockCartService.addAssetToProjectInCart).toHaveBeenCalledWith({
            lineItem: {
              selectedTranscodeTarget: 'Target',
              price: 100,
              asset: { assetId: 123123 }
            },
            markers: { some: 'markers' },
            attributes: undefined
          });
        });
      });
    });

    describe('getPricingAttributes', () => {
      it('should call the getPriceAttributes on the assetService if there is not rights reproduction cached', () => {
        componentUnderTest.getPricingAttributes('Rights Managed');

        expect(mockPricingService.getPriceAttributes).toHaveBeenCalledWith('Rights Managed');
      });

      it('should get the price if the rights reproduction doesnt match the cache', () => {
        componentUnderTest.rightsReproduction = 'Rights Managed';
        componentUnderTest.getPricingAttributes('Rights Managed');

        expect(mockPricingService.getPriceAttributes).not.toHaveBeenCalled();
      });
    });

    describe('previousPage()', () => {
      it('should call the back method on the window api', () => {
        componentUnderTest.previousPage();
        expect(mockWindow.nativeWindow.history.back).toHaveBeenCalled();
      });
    });

    describe('onMarkersChange', () => {
      describe('when there are no selected attributes', () => {
        it('does not call getPriceFor() on the asset service', () => {
          componentUnderTest.onMarkersChange({ in: {}, out: {} } as any);
          expect(mockPricingService.getPriceFor).not.toHaveBeenCalled();
        });
      });
    });

    describe('assetMatchesCartAsset()', () => {
      ['collectionAsset', 'orderAsset', 'quoteShowAsset', 'searchAsset'].forEach((assetType: EnhancedMock.AssetType) => {
        it(`returns true (somewhat pointlessly) for an asset with type '${assetType}'`, () => {
          mockStore.createStateSection(assetType, { activeAsset: mockAsset });
          componentUnderTest.assetType = assetType;
          componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;

          expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
        });
      });

      ['cartAsset', 'quoteEditAsset'].forEach((assetType: EnhancedMock.AssetType) => {
        describe(`when asset has type '${assetType}'`, () => {
          let localMockAsset: any;

          beforeEach(() => {
            if (assetType === 'quoteEditAsset') mockStore.createStateSection('quoteEdit', { data: { id: 1 } });
            (assetType === 'cartAsset' ? mockCartService : mockQuoteEditService).state = {
              data: {
                projects: [
                  {
                    lineItems: [
                      { id: 'ABCD', asset: { timeStart: 1000, timeEnd: 2000 } },
                      { id: 'EFGH' }
                    ]
                  },
                  {
                    lineItems: [
                      {
                        id: 'IJKL', asset: {}, attributes: [
                          { priceAttributeName: 'a', selectedAttributeValue: '1' },
                          { priceAttributeName: 'b', selectedAttributeValue: '2' },
                          { priceAttributeName: 'c', selectedAttributeValue: '3' }
                        ]
                      },
                      {
                        id: 'MNOP', asset: {}, attributes: [
                          { priceAttributeName: 'a', selectedAttributeValue: '1' },
                          { priceAttributeName: 'b', selectedAttributeValue: '2' },
                          { priceAttributeName: 'c', selectedAttributeValue: 'NOT 3' }
                        ]
                      },
                      {
                        id: 'QRST', asset: {}, attributes: [
                          { priceAttributeName: 'a', selectedAttributeValue: '1' },
                          { priceAttributeName: 'b', selectedAttributeValue: '2' }
                        ]
                      }
                    ]
                  }
                ]
              }
            };

            const mockAppliedAttributes = { a: '1', b: '2', c: '3' };
            mockDialogService.openComponentInDialog =
              jasmine.createSpy('openComponentInDialog').and.callFake((parameters: any) => {
                parameters.outputOptions[0].callback(
                  { type: 'APPLY_PRICE', payload: { attributes: mockAppliedAttributes } },
                  { close: jasmine.createSpy('close') }
                );
              });

            componentUnderTest = new AssetComponent(
              mockCurrentUserService, mockCapabilities, mockUiState,
              mockAssetService, mockUiConfig, mockWindow, mockRouter, mockRoute, mockStore, mockUserPreference, mockCartService,
              mockSnackBar, mockTranslate, mockDialogService, mockQuoteEditService, mockPricingStore, mockPricingService,
              null
            );

            componentUnderTest.assetType = assetType;
          });

          it('returns true when the asset has no corresponding cart line item', () => {
            localMockAsset = { uuid: '????' };
            mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
            componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;

            expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
          });

          it('returns true when the asset\'s corresponding cart line item has no asset', () => {
            localMockAsset = { uuid: 'EFGH' };
            mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
            componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;

            expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
          });

          describe('when price attributes have not been changed by the user', () => {
            beforeEach(() => {
              localMockAsset = { uuid: 'ABCD' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;
            });

            it('returns true when subclip markers match', () => {
              componentUnderTest.onMarkersChange({
                in: new Frame(30).setFromFrameNumber(30), // 1000ms
                out: new Frame(30).setFromFrameNumber(60) // 2000ms
              });

              expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
            });

            it('returns true when neither the cart asset nor the active asset has markers', () => {
              localMockAsset = { uuid: 'IJKL' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;

              expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
            });

            it('returns false when subclip markers don\'t match', () => {
              componentUnderTest.onMarkersChange({
                in: new Frame(30).setFromFrameNumber(30), // 1000ms
                out: new Frame(30).setFromFrameNumber(6000) // 200000ms
              });

              expect(componentUnderTest.assetMatchesCartAsset).toBe(false);
            });

            it('returns false when the cart asset has subclip markers and the active asset doesn\'t', () => {
              expect(componentUnderTest.assetMatchesCartAsset).toBe(false);
            });

            it('returns false when the active asset has subclip markers and the cart asset doesn\'t', () => {
              localMockAsset = { uuid: 'IJKL' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;

              componentUnderTest.onMarkersChange({
                in: new Frame(30).setFromFrameNumber(30), // 1000ms
                out: new Frame(30).setFromFrameNumber(60) // 2000ms
              });

              expect(componentUnderTest.assetMatchesCartAsset).toBe(false);
            });
          });

          describe('when price attributes have been changed by the user', () => {
            it('returns true when the attributes match', () => {
              localMockAsset = { uuid: 'IJKL' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;
              componentUnderTest.rightsReproduction = 'some rights reproduction';
              componentUnderTest.getPricingAttributes('some rights reproduction');

              expect(componentUnderTest.assetMatchesCartAsset).toBe(true);
            });

            it('returns false when the attributes don\'t match', () => {
              localMockAsset = { uuid: 'MNOP' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;
              componentUnderTest.rightsReproduction = 'some rights reproduction';
              componentUnderTest.getPricingAttributes('some rights reproduction');


              expect(componentUnderTest.assetMatchesCartAsset).toBe(false);
            });

            it('returns false when the number of attributes doesn\'t match', () => {
              localMockAsset = { uuid: 'QRST' };
              mockStore.createStateSection(assetType, { activeAsset: localMockAsset });
              componentUnderTest.stateMapper = factory => (factory as any)[assetType].activeAsset;
              componentUnderTest.rightsReproduction = 'some rights reproduction';
              componentUnderTest.getPricingAttributes('some rights reproduction');


              expect(componentUnderTest.assetMatchesCartAsset).toBe(false);
            });
          });
        });
      });
    });
  });

  function mockActiveCollectionAndAsset(id?: number) {
    let currentId = (id) ? id : 8854642;
    let mockAsset = { 'name': 'id', 'value': currentId, 'assetId': currentId };
    let mockCollection = {
      'id': 123,
      'assets': {
        'items': [
          { 'assetId': 8854642, 'uuid': 'adf3a8d2-8738-4c70-834d-0d7785d7e226' },
          { 'assetId': 31996532, 'uuid': 'e8e82d76-e85a-4289-8fa6-b730ded0bf16' },
          { 'assetId': 25015116, 'uuid': '739d6f81-247f-4b24-8121-c656852c05ff' },
          { 'assetId': 25015124, 'uuid': 'a1ed7a37-da0e-4365-8f54-af8b4a8cdd19' },
          { 'assetId': 25014612, 'uuid': '03101287-736b-4cc4-89f3-700d958a45b8' }
        ]
      }
    };
    return Object.assign({}, { collection: mockCollection }, { asset: mockAsset });
  }
}
