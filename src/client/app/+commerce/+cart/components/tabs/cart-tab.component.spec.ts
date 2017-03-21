import { Observable } from 'rxjs/Rx';
import { CartTabComponent } from './cart-tab.component';
import { EditProjectComponent } from '../edit-project.component';
import { WzSubclipEditorComponent } from '../../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { WzPricingComponent } from '../../../../shared/components/wz-pricing/wz.pricing.component';

export function main() {
  describe('Cart Tab Component', () => {
    let componentUnderTest: CartTabComponent, mockCartService: any, mockUiConfig: any, mockDialog: any,
      mockAssetService: any, mockUserPreference: any, mockDocument: any, mockWindow: any, mockState: any,
      mockQuoteService: any, mockTranslateService: any, mockSnackbar: any;

    beforeEach(() => {
      mockState = {
        cart: {
          itemCount: 2,
          projects: [{
            lineItems: [
              { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
              { id: '2', price: 100, rightsManaged: 'Rights Managed' }
            ]
          }]
        }
      };

      mockCartService = {
        data: Observable.of({ cart: { someData: 'SOME_VALUE' } }),
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
        get: jasmine.createSpy('get').and.returnValue(Observable.of({
          config: { form: 'SOME_CONFIG', createQuote: { items: [] } }
        }))
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
            cancel: Observable.of({}),
            save: Observable.of({}),
            pricingEvent: Observable.of({}),
            cacheSuggestions: Observable.of({})
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

      mockQuoteService = {
        createQuote: jasmine.createSpy('createQuote').and.returnValue(Observable.of({}))
      };

      mockTranslateService = {
        get: jasmine.createSpy('createQuote').and.returnValue(Observable.of(''))
      };

      mockSnackbar = {
        open: jasmine.createSpy('open')
      };

      componentUnderTest = new CartTabComponent(
        null, mockCartService, mockUiConfig, mockDialog,
        mockAssetService, mockWindow, mockUserPreference,
        null, mockQuoteService, mockDocument, mockSnackbar,
        mockTranslateService
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

        expect(componentUnderTest.config).toEqual({ form: 'SOME_CONFIG', createQuote: { items: [] } });
      });
    });

    describe('Destruction', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null, null, null, null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('assetsInCart()', () => {
      it('returns an observable of false when the cart has no items', () => {
        mockCartService.data = Observable.of({ cart: { itemCount: 0 } });

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null, null, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of false when the cart has no itemCount member', () => {
        mockCartService.data = Observable.of({ cart: {} });

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null, null, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of true when the cart has at least one line item', () => {
        mockCartService.data = Observable.of({ cart: { itemCount: 1 } });

        componentUnderTest = new CartTabComponent(
          null, mockCartService, mockUiConfig, mockDialog,
          null, mockWindow, mockUserPreference, null, null, null, null, null
        );
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('onOpenQuoteDialog()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('should open a dialog', () => {
        componentUnderTest.onOpenQuoteDialog();
        expect(mockDialog.open).toHaveBeenCalled();
      });
    });

    describe('onSaveAsDraft()', () => {
      it('should call createQuote() on the quote service', () => {
        componentUnderTest.onSaveAsDraft();
        expect(mockQuoteService.createQuote).toHaveBeenCalled();
      });
    });

    describe('rmAssetsHaveAttributes()', () => {
      it('should return false if there is an RM asset without attributes', () => {
        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(false);
      });

      it('should return true if all assets are valid', () => {
        mockState = {
          cart: {
            itemCount: 0,
            projects: [{
              lineItems: [
                { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '3', price: 59, rightsManaged: 'Royalty Free' }
              ]
            }]
          }
        };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });

      it('should return true if the cart is empty', () => {
        mockState = { cart: { itemCount: 0 } };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CartTabComponent(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });
    });

    describe('onSelectQuoteType()', () => {
      it('should set the quoteType instance variable', () => {
        componentUnderTest.onSelectQuoteType({ type: 'offlineAgreement' });
        expect(componentUnderTest.quoteType).toBe('offlineAgreement');
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

        expect(mockDialog.open).toHaveBeenCalledWith(EditProjectComponent, { position: { top: '14%' } });
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
        expect(mockDialog.open).toHaveBeenCalledWith(WzSubclipEditorComponent, { width: '544px' });
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
