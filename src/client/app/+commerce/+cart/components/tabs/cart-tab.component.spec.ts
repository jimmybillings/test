import { Observable } from 'rxjs/Rx';
import { CartTabComponent } from './cart-tab.component';
import { EditProjectComponent } from '../edit-project.component';
import { WzAdvancedPlayerComponent } from
  '../../../../shared/modules/wz-player/components/wz-advanced-player/wz.advanced-player.component';
import { WzPricingComponent } from '../../../../shared/components/wz-pricing/wz.pricing.component';

export function main() {
  describe('Cart Tab Component', () => {
    let componentUnderTest: CartTabComponent;
    let mockCartService: any;
    let mockUiConfig: any;
    let mockDialog: any;
    let mockAssetService: any;
    let mockUserPreference: any;
    let mockDocument: any;
    let mockWindow: any;
    let mockState: any;

    beforeEach(() => {
      mockState = {
        itemCount: 2,
        projects: [{
          lineItems: [
            { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
            { id: '2', price: 100, rightsManaged: 'Rights Managed' }
          ]
        }]
      };

      mockCartService = {
        data: Observable.of({ someData: 'SOME_VALUE' }),
        addProject: jasmine.createSpy('addProject'),
        removeProject: jasmine.createSpy('removeProject'),
        updateProject: jasmine.createSpy('updateProject'),
        moveLineItemTo: jasmine.createSpy('moveLineItemTo'),
        cloneLineItem: jasmine.createSpy('cloneLineItem'),
        removeLineItem: jasmine.createSpy('removeLineItem'),
        editLineItem: jasmine.createSpy('editLineItem'),
        state: mockState
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: 'SOME_CONFIG' }))
      };
      mockDocument = {
        body: {
          classList: {
            add: jasmine.createSpy('add'),
            remove: jasmine.createSpy('remove')
          }
        }
      };

      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({
          componentInstance: {
            onSubclip: Observable.of({}),
            pricingEvent: Observable.of({})
          },
          afterClosed: function () {
            return Observable.of({ data: 'hi' });
          },
          close: () => { return true; }
        })
      };

      mockWindow = { nativeWindow: { location: { href: {} } } };

      mockAssetService = {
        getClipPreviewData: jasmine.createSpy('getClipPreviewData').and.returnValue(Observable.of({ url: 'fake url' })),
        getPriceAttributes: jasmine.createSpy('getPriceAttributes').and.returnValue(Observable.of({ some: 'attribute' })),
        getPrice: jasmine.createSpy('getPrice').and.returnValue(Observable.of({ price: 100 }))
      };

      mockUserPreference = {
        data: Observable.of({ pricingPreferences: { some: 'attribute' } })
      };

      componentUnderTest = new CartTabComponent(
        null, mockCartService, mockUiConfig, mockDialog,
        mockAssetService, mockWindow, mockUserPreference, null, mockDocument
      );
    });

    describe('Initialization', () => {
      it('connects to the CartService data', () => {
        componentUnderTest.ngOnInit();

        componentUnderTest.cart.subscribe((cartData) => {
          expect(cartData.someData).toBe('SOME_VALUE');
        });
      });

      it('gets the UI config specifically for the cart', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('cart');
      });

      it('caches the cart UI config', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.config).toEqual('SOME_CONFIG');
      });
    });

    describe('Destruction', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('assetsInCart()', () => {
      it('returns an observable of false when the cart has no items', () => {
        mockCartService.data = Observable.of({ itemCount: 0 });

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of false when the cart has no itemCount member', () => {
        mockCartService.data = Observable.of({});

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of true when the cart has at least one line item', () => {
        mockCartService.data = Observable.of({ itemCount: 1 });

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('rmAssetsHaveAttributes()', () => {
      it('should return false if there is an RM asset without attributes', () => {
        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(false);
      });

      it('should return true if all assets are valid', () => {
        mockState = {
          itemCount: 0,
          projects: [{
            lineItems: [
              { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
              { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
              { id: '3', price: 59, rightsManaged: 'Royalty Free' }
            ]
          }]
        };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });

      it('should return true if the cart is empty', () => {
        mockState = { itemCount: 0 };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });
    });

    describe('onNotification()', () => {
      it('adds a project when notified with ADD_PROJECT', () => {
        componentUnderTest.onNotification({ type: 'ADD_PROJECT' });

        expect(mockCartService.addProject).toHaveBeenCalled();
      });

      it('removes a project when notified with REMOVE_PROJECT', () => {
        let mockProject = {};
        componentUnderTest.onNotification({ type: 'REMOVE_PROJECT', payload: mockProject });

        expect(mockCartService.removeProject).toHaveBeenCalledWith(mockProject);
      });

      it('updates a project when notified with UPDATE_PROJECT', () => {
        let mockProject = {};
        componentUnderTest.onNotification({ type: 'UPDATE_PROJECT', payload: mockProject });

        expect(mockDialog.open).toHaveBeenCalledWith(EditProjectComponent, { width: '600px' });
      });

      it('moves a line item when notified with MOVE_LINE_ITEM', () => {
        let mockProject = {};
        let mockLineItem = {};
        componentUnderTest.onNotification({
          type: 'MOVE_LINE_ITEM',
          payload: { lineItem: mockLineItem, otherProject: mockProject }
        });

        expect(mockCartService.moveLineItemTo).toHaveBeenCalledWith(mockProject, mockLineItem);
      });

      it('clones a line item when notified with CLONE_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification({ type: 'CLONE_LINE_ITEM', payload: mockLineItem });

        expect(mockCartService.cloneLineItem).toHaveBeenCalledWith(mockLineItem);
      });

      it('clones a line item when notified with REMOVE_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification({ type: 'REMOVE_LINE_ITEM', payload: mockLineItem });

        expect(mockCartService.removeLineItem).toHaveBeenCalledWith(mockLineItem);
      });

      it('edits a line item when notified with EDIT_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification(
          {
            type: 'EDIT_LINE_ITEM',
            payload: {
              lineItem: mockLineItem, fieldToEdit: { selectedTranscodeTarget: '1080i' }
            }
          });

        expect(mockCartService.editLineItem).toHaveBeenCalledWith(mockLineItem, { selectedTranscodeTarget: '1080i' });
      });

      it('edits the assets in and out markers with  EDIT_LINE_ITEM_MARKERS', () => {
        let mockAsset = { assetId: 1234 };
        componentUnderTest.onNotification({ type: 'EDIT_LINE_ITEM_MARKERS', payload: { asset: mockAsset } });

        expect(mockAssetService.getClipPreviewData).toHaveBeenCalledWith(1234);
        expect(mockDialog.open).toHaveBeenCalledWith(WzAdvancedPlayerComponent, { width: '544px' });
      });

      describe('calls openPricingDialog with SHOW_PRICING_DIALOG', () => {
        it('should get the price attributes if they dont already exist', () => {
          let mockLineItem = { asset: { assetId: 123456 } };
          componentUnderTest.onNotification({ type: 'SHOW_PRICING_DIALOG', payload: mockLineItem });

          expect(mockAssetService.getPriceAttributes).toHaveBeenCalled();
          expect(mockDialog.open).toHaveBeenCalledWith(WzPricingComponent);
        });

        it('should not get the attributes if they already exist', () => {
          let mockLineItem = { asset: { assetId: 123456 } };
          componentUnderTest.priceAttributes = { some: 'attr' };
          componentUnderTest.onNotification({ type: 'SHOW_PRICING_DIALOG', payload: mockLineItem });

          expect(mockAssetService.getPriceAttributes).not.toHaveBeenCalled();
          expect(mockDialog.open).toHaveBeenCalledWith(WzPricingComponent);
        });
      });
    });
  });
};
