import { Observable } from 'rxjs/Observable';
import { CommerceEditTab } from './commerce-edit-tab';
import { WzSubclipEditorComponent } from '../../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { WzPricingComponent } from '../../../shared/components/wz-pricing/wz.pricing.component';

export function main() {
  describe('Commerce Edit tab', () => {
    let componentUnderTest: CommerceEditTab, mockCartService: any, mockUiConfig: any, mockDialogService: any,
      mockAssetService: any, mockUserPreference: any, mockDocument: any, mockWindow: any, mockState: any,
      mockQuoteService: any, mockTranslateService: any, mockSnackbar: any, mockPricingStore: any;

    beforeEach(() => {
      mockState = {
        data: {
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
        data: Observable.of({ data: { someData: 'SOME_VALUE' } }),
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

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({ data: 'Test data' })),
        openFormDialog: jasmine.createSpy('openFormDialog').and.returnValue(Observable.of({ data: 'Test data' }))
      };

      mockWindow = { nativeWindow: { location: { href: {} } } };

      mockAssetService = {
        getClipPreviewData: jasmine.createSpy('getClipPreviewData').and.returnValue(Observable.of({ url: 'fake url' })),
        getPriceAttributes: jasmine.createSpy('getPriceAttributes').and.returnValue(Observable.of({ some: 'attribute' })),
        getPrice: jasmine.createSpy('getPrice').and.returnValue(Observable.of({ price: 100 })),
        enhance: () => { }
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

      mockPricingStore = {
        priceForDialog: Observable.of(1000)
      };

      componentUnderTest = new CommerceEditTab(
        null, mockCartService, mockUiConfig, mockDialogService,
        mockAssetService, mockWindow, mockUserPreference,
        null, mockDocument, mockSnackbar,
        mockTranslateService, mockPricingStore
      );
    });

    describe('Initialization', () => {

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

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, mockUiConfig, mockDialogService,
          null, mockWindow, mockUserPreference, null, null, null, null,
          null
        );
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });


    describe('rmAssetsHaveAttributes()', () => {
      it('should return false if there is an RM asset without attributes', () => {
        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(false);
      });

      it('should return true if all assets are valid', () => {
        mockState = {
          data: {
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

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });

      it('should return true if the cart is empty', () => {
        mockState = { data: { itemCount: 0 } };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.rmAssetsHaveAttributes).toBe(true);
      });
    });



    describe('cartContainsNoAssets()', () => {

      it('should return true if the cart is empty', () => {
        mockState = { data: { itemCount: 0 } };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.cartContainsNoAssets).toBe(true);
      });

      it('should return false if the cart is has 1 or more assets', () => {
        mockState = { data: { itemCount: 1 } };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.cartContainsNoAssets).toBe(false);
      });
    });


    describe('showUsageWarning()', () => {

      it('should return false if the cart is empty', () => {
        mockState = { data: { itemCount: 0 } };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.showUsageWarning).toBe(false);
      });

      it('should return true if cart has assets and 1 or more RM assets are missing attributes ', () => {
        mockState = {
          data: {
            itemCount: 3,
            projects: [{
              lineItems: [
                { id: '1', price: 100, rightsManaged: 'Rights Managed' },
                { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '3', price: 59, rightsManaged: 'Royalty Free' }
              ]
            }]
          }
        };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.showUsageWarning).toBe(true);
      });

      it('should return false if cart has assets and all RM assets have attributes ', () => {
        mockState = {
          data: {
            itemCount: 3,
            projects: [{
              lineItems: [
                { id: '1', price: 189, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '3', price: 59, rightsManaged: 'Royalty Free' }
              ]
            }]
          }
        };

        mockCartService = {
          state: mockState
        };

        componentUnderTest = new CommerceEditTab(
          null, mockCartService, null, null, null, null, null, null, null, null, null, null
        );

        expect(componentUnderTest.showUsageWarning).toBe(false);
      });
    });


    describe('onSelectQuoteType()', () => {
      it('should set the quoteType instance variable', () => {
        componentUnderTest.onSelectQuoteType({ type: 'OfflineAgreement' });
        expect(componentUnderTest.quoteType).toBe('OfflineAgreement');
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

        expect(mockDialogService.openFormDialog).toHaveBeenCalled();
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

      it('edits the assets in and out markers with EDIT_LINE_ITEM_MARKERS', () => {
        let mockAsset = { assetId: 1234 };
        componentUnderTest.onNotification({ type: 'EDIT_LINE_ITEM_MARKERS', payload: { asset: mockAsset } });

        expect(mockAssetService.getClipPreviewData).toHaveBeenCalledWith(1234);
      });

      it('edits the project pricing with EDIT_PROJECT_PRICING', () => {
        let mockAsset = { assetId: 1234 };
        componentUnderTest.onNotification({ type: 'EDIT_PROJECT_PRICING', payload: { asset: mockAsset } });

        expect(mockAssetService.getPriceAttributes).toHaveBeenCalledWith();
      });

      describe('calls openPricingDialog with SHOW_PRICING_DIALOG', () => {
        it('should not get the attributes if they already exist', () => {
          let mockLineItem = { asset: { assetId: 123456 } };
          componentUnderTest.priceAttributes = { some: 'attr' } as any;
          componentUnderTest.onNotification({ type: 'SHOW_PRICING_DIALOG', payload: mockLineItem });

          expect(mockAssetService.getPriceAttributes).not.toHaveBeenCalled();
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });

        it('should get the price attributes if they don\'t already exist', () => {
          let mockLineItem = {
            asset: { assetId: 123456 },
            attributes: [{ priceAttributeName: 'Use', selectedAttributeValue: 'Feature Film' }]
          };
          componentUnderTest.onNotification({ type: 'SHOW_PRICING_DIALOG', payload: mockLineItem });

          expect(mockAssetService.getPriceAttributes).toHaveBeenCalled();
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });
    });
  });
};
