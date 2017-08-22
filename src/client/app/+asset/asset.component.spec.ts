import { AssetComponent } from './asset.component';
import { MockAppStore } from '../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Asset Component', () => {

    let mockCurrentUserService: any, mockCapabilities: any, mockSearchContext: any, mockUiState: any;
    let mockUserPreference: any, mockAssetService: any, mockUiConfig: any, mockErrorStore: any, mockCart: any,
      mockWindow: any, mockDialogService: any, mockTranslate: any, mockSnackBar: any, mockQuoteEditService: any,
      mockPricingStore: any, mockPricingService: any;
    let mockStore: MockAppStore;
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      mockCurrentUserService = {};
      mockCapabilities = { administerQuotes: () => false };
      mockUiState = {};
      mockUserPreference = {
        openCollectionTray: jasmine.createSpy('openCollectionTray'),
        state: { pricingPreferences: 'thePricingPreferences' }
      };
      mockAssetService = {
        downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of({})),
        state: { asset: { assetId: 123456 } },
        priceForDetails: Observable.of(100)
      };
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { pageSize: { value: 20 } } })) };
      mockErrorStore = { dispatch: jasmine.createSpy('dispatch') };
      mockCart = { addAssetToProjectInCart: jasmine.createSpy('addAssetToProjectInCart') };
      mockWindow = { nativeWindow: { location: { href: {} }, history: { back: jasmine.createSpy('back') } } };
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
        mockAssetService, mockUiConfig, mockWindow, mockStore, mockUserPreference, mockErrorStore, mockCart,
        mockSnackBar, mockTranslate, mockDialogService, mockQuoteEditService, mockPricingStore, mockPricingService
      );
    });

    describe('ngOnInit()', () => {
      it('Should call the config service to get global configurations', () => {
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.get).toHaveBeenCalledWith('global');
      });
    });

    describe('downloadComp()', () => {
      it('Should call the service with the correct params to download a comp', () => {
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockAssetService.downloadComp).toHaveBeenCalledWith('123123', 'New Comp');
      });

      it('Should show a notification if the server reponds that no comp is available', () => {
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockErrorStore.dispatch).toHaveBeenCalledWith({ status: 'COMPS.NO_COMP' });
      });

      it('Should set the window.href.url to the location of the comp url if the server responsds with a downloadable comp url', () => {
        mockAssetService = {
          downloadComp: jasmine.createSpy('downloadComp').and.returnValue(
            Observable.of({ url: 'http://downloadcomp.url' }))
        };
        componentUnderTest = new AssetComponent(
          mockCurrentUserService, mockCapabilities, mockUiState,
          mockAssetService, mockUiConfig, mockWindow, mockStore, mockUserPreference, mockErrorStore,
          mockCart, mockSnackBar, mockTranslate, mockDialogService, mockQuoteEditService, mockPricingStore, mockPricingService
        );
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockWindow.nativeWindow.location.href).toEqual('http://downloadcomp.url');
      });

    });

    describe('addAssetToCart()', () => {
      describe('Should call the cart summary service with the correct params', () => {
        it('with a price', () => {
          componentUnderTest.addAssetToCart({ assetId: 123123, selectedTranscodeTarget: 'Target' });
          expect(mockCart.addAssetToProjectInCart).toHaveBeenCalledWith({
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
          expect(mockCart.addAssetToProjectInCart).toHaveBeenCalledWith({
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
        it('calls getPriceFor() on the asset service', () => {
          componentUnderTest.onMarkersChange({ in: {}, out: {} } as any);
          expect(mockPricingService.getPriceFor).not.toHaveBeenCalled();
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
