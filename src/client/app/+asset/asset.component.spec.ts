import { AssetComponent } from './asset.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Asset Component', () => {

    let mockCurrentUserService: any, mockCapabilities: any, mockActiveCollection: any, mockSearchContext: any, mockUiState: any;
    let mockUserPreference: any, mockAssetService: any, mockUiConfig: any, mockErrorStore: any, mockCart: any,
      mockWindow: any, mockMdDialog: any, mockTranslate: any, mockSnackBar: any;
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      mockCurrentUserService = {};
      mockCapabilities = {};
      mockActiveCollection = {
        addAsset: jasmine.createSpy('addAsset').and.returnValue(Observable.of({})),
        removeAsset: jasmine.createSpy('removeAsset').and.returnValue(Observable.of({})),
        getItems: jasmine.createSpy('getItems').and.returnValue(Observable.of({}))
      };
      mockSearchContext = {};
      mockUiState = {};
      mockUserPreference = {
        openCollectionTray: jasmine.createSpy('openCollectionTray'),
        state: { pricingPreferences: 'thePricingPreferences' }
      };
      mockAssetService = {
        downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of({})),
        getPrice: jasmine.createSpy('getPrice').and.returnValue(Observable.of({})),
        getPriceAttributes: jasmine.createSpy('getPriceAttributes').and.returnValue(Observable.of({})),
        state: { assetId: 123456 }
      };
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { pageSize: { value: 20 } } })) };
      mockErrorStore = { dispatch: jasmine.createSpy('dispatch') };
      mockCart = { addAssetToProjectInCart: jasmine.createSpy('addAssetToProjectInCart') };
      mockWindow = { location: { href: {} } };
      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of([]))
      };
      mockSnackBar = {
        open: () => { }
      };
      mockMdDialog = {
        open: function () {
          return {
            componentInstance: {
              calculatePrice: Observable.of({ some: 'data' })
            },
            afterClosed: jasmine.createSpy('afterClosed').and.returnValue(Observable.of({}))
          };
        }
      };

      componentUnderTest = new AssetComponent(
        mockCurrentUserService, mockCapabilities, mockActiveCollection, mockSearchContext, mockUiState,
        mockAssetService, mockUiConfig, mockWindow, mockUserPreference, mockErrorStore, mockCart,
        mockSnackBar, mockTranslate, mockMdDialog);

    });

    describe('ngOnInit()', () => {
      it('Should call the config service to get global configurations', () => {
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.get).toHaveBeenCalledWith('global');
      });
    });

    describe('addToCollection()', () => {
      it('Should open the collection tray when adding a asset to a collection', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.addToCollection({ collection: { id: 1 }, asset: { name: 123123 } });
        expect(mockUserPreference.openCollectionTray).toHaveBeenCalled();
      });

      it('Should call the service to add and item to a collection', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.addToCollection({ collection: { id: 1 }, asset: { name: 123123 } });
        expect(mockActiveCollection.addAsset).toHaveBeenCalledWith(1, { name: 123123 });
      });

      it('Should call the service to get active collection items after an asset has succesfully been added', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.addToCollection({ collection: { id: 1 }, asset: { name: 123123 } });
      });
    });

    describe('removeFromCollection()', () => {
      it('Should open the collection tray when an asset is removed', () => {
        componentUnderTest.removeFromCollection(mockActiveCollectionAndAsset());
        expect(mockUserPreference.openCollectionTray).toHaveBeenCalled();
      });

      it('Should find the uuid of the correct asset in the collection to remove and call the service with it for removal', () => {
        componentUnderTest.removeFromCollection(mockActiveCollectionAndAsset());
        expect(mockActiveCollection.removeAsset).toHaveBeenCalledWith(mockActiveCollectionAndAsset());
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
          mockCurrentUserService, mockCapabilities, mockActiveCollection, mockSearchContext, mockUiState,
          mockAssetService, mockUiConfig, mockWindow, mockUserPreference, mockErrorStore,
          mockCart, mockSnackBar, mockTranslate, mockMdDialog);
        componentUnderTest.downloadComp({ assetId: '123123', compType: 'New Comp' });
        expect(mockWindow.location.href).toEqual('http://downloadcomp.url');
      });

    });

    describe('addAssetToCart()', () => {
      it('Should call the cart summary service with correct params to add an asset to the cart', () => {
        componentUnderTest.usagePrice = Observable.of(100);
        componentUnderTest.addAssetToCart({ assetId: 123123, selectedTranscodeTarget: 'Target' });
        expect(mockCart.addAssetToProjectInCart).toHaveBeenCalledWith({
          lineItem: {
            selectedTranscodeTarget: 'Target',
            price: 100,
            asset: {
              assetId: 123123,
              startTime: undefined,
              endTime: undefined
            }
          },
          attributes: undefined
        });
      });
    });

    describe('onCalculatePrice', () => {
      it('should call the getPrice method on the assetService', () => {
        componentUnderTest.calculatePrice({ 'a': 'b', 'c': 'd' });

        expect(mockAssetService.getPrice).toHaveBeenCalledWith(123456, { 'a': 'b', 'c': 'd' });
      });
    });

    describe('getPricingAttributes', () => {
      it('should call the getPriceAttributes on the assetService', () => {
        componentUnderTest.getPricingAttributes('Rights Managed');

        expect(mockAssetService.getPriceAttributes).toHaveBeenCalledWith('Rights Managed');
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
