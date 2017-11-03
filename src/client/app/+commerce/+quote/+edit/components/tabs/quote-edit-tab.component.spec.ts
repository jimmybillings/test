import { Pojo } from '../../../../../shared/interfaces/common.interface';
import { Observable } from 'rxjs/Observable';
import { CommerceEditTab } from '../../../../components/tabs/commerce-edit-tab';
import { MockAppStore } from '../../../../../store/spec-helpers/mock-app.store';
import { QuoteEditTabComponent } from './quote-edit-tab.component';

export function main() {
  describe('Quote Edit Tab Component', () => {
    let componentUnderTest: QuoteEditTabComponent;
    let deleteQuoteDispatchSpy: jasmine.Spy;
    let addCustomPriceDispatchSpy: jasmine.Spy;
    let snackbarSpy: jasmine.Spy;
    let quoteSendSpy: jasmine.Spy;
    let mockStore: MockAppStore;
    let mockCapabilities: any;
    let mockDialogService: any;
    let mockWindow: any;
    let mockUserPreference: any;
    let mockRouter: any;
    let mockDocument: any;
    let initPricingSpy: jasmine.Spy;
    let setPriceSpy: jasmine.Spy;

    beforeEach(() => {
      mockCapabilities = {
        cloneQuote: jasmine.createSpy('cloneQuote'),
        administerQuotes: () => false
      };

      mockDialogService = {
        openFormDialog: jasmine.createSpy('openFormDialog').and.callFake((_: any, __: any, onSubmitCallback: Function) => {
          mockDialogService.onSubmitCallback = onSubmitCallback;
        }),
        openConfirmationDialog: jasmine.createSpy('openConfirmationDialog').and.callFake((_: any, onAcceptCallback: Function) => {
          mockDialogService.onAcceptCallback = onAcceptCallback;
        }),
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({ data: 'Test data' })),
      };
      mockWindow = { nativeWindow: { location: { href: {} } } };
      mockDocument = {
        body: {
          classList: {
            add: jasmine.createSpy('add'),
            remove: jasmine.createSpy('remove')
          }
        }
      };

      mockUserPreference = { data: Observable.of({ pricingPreferences: { some: 'attribute' } }) };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      mockStore = new MockAppStore();
      initPricingSpy = mockStore.createActionFactoryMethod('pricing', 'initializePricing');
      setPriceSpy = mockStore.createActionFactoryMethod('pricing', 'setPriceForDialog');

      mockStore.createStateSection('uiConfig', {
        components: {
          quoteComment: { config: { form: { items: [{ some: 'config' }] } } },
          cart: {
            config: {
              form: { items: ['comment', 'stuff'] },
              createQuote: { items: [{ name: 'purchaseType', value: '' }] },
              addBulkOrderId: { items: [{ some: 'bulk' }] },
              addDiscount: { items: [{ some: 'discount' }] },
              addCostMultiplier: { items: [{ some: 'multiplier' }] },
              bulkImport: { items: [{ some: 'import' }] },
              quotePurchaseType: { items: [{ value: 'SystemLicense', viewValue: 'System License' }] }
            }
          }
        }
      });

      deleteQuoteDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'delete');
      addCustomPriceDispatchSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addCustomPriceToLineItem');
      snackbarSpy = mockStore.createActionFactoryMethod('snackbar', 'display');
      quoteSendSpy = mockStore.createActionFactoryMethod('quoteEdit', 'sendQuote');

      componentUnderTest =
        new QuoteEditTabComponent(
          mockCapabilities, mockDialogService,
          mockWindow, mockUserPreference, mockDocument, mockStore
        );
    });

    // This gets used down below for some tedious setup in the editBulkId and editDiscount blocks
    let setupFor = (propertyInQuestion: any) => {
      componentUnderTest = new QuoteEditTabComponent(
        mockCapabilities, mockDialogService,
        mockWindow, mockUserPreference, mockDocument, mockStore
      );
      return componentUnderTest;
    };

    describe('Constructor', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('sets up the config instance variable', () => {
        expect(componentUnderTest.config).toEqual({
          form: { items: ['comment', 'stuff'] },
          createQuote: { items: [{ name: 'purchaseType', value: '' }] },
          addBulkOrderId: { items: [{ some: 'bulk' }] },
          addDiscount: { items: [{ some: 'discount' }] },
          addCostMultiplier: { items: [{ some: 'multiplier' }] },
          bulkImport: { items: [{ some: 'import' }] },
          quotePurchaseType: { items: [{ value: 'SystemLicense', viewValue: 'System License' }] }
        });
      });
    });

    describe('onNotification()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('ADD_QUOTE_FEE', () => {
        let quoteFeeSpy: jasmine.Spy;
        beforeEach(() => { quoteFeeSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addFeeTo'); });
        it('calls the addFeeTo() service method', () => {
          componentUnderTest.onNotification(
            { type: 'ADD_QUOTE_FEE', payload: { project: { some: 'project' }, fee: { some: 'fee' } } }
          );

          expect(quoteFeeSpy).toHaveBeenCalledWith({ some: 'project' }, { some: 'fee' });
        });

        it('throws an error if the message doesn\'t have a payload', () => {
          expect(() => componentUnderTest.onNotification({ type: 'ADD_QUOTE_FEE' })).toThrowError();
        });
      });

      describe('REMOVE_QUOTE_FEE', () => {
        let quoteFeeSpy: jasmine.Spy;
        beforeEach(() => { quoteFeeSpy = mockStore.createActionFactoryMethod('quoteEdit', 'removeFee'); });
        it('calls the removeFee() service method', () => {
          componentUnderTest.onNotification(
            { type: 'REMOVE_QUOTE_FEE', payload: { some: 'fee' } }
          );

          expect(quoteFeeSpy).toHaveBeenCalledWith({ some: 'fee' });
        });
      });

      describe('SHOW_COST_MULTIPLIER_DIALOG', () => {
        let quoteFeeSpy: jasmine.Spy;
        beforeEach(() => { quoteFeeSpy = mockStore.createActionFactoryMethod('quoteEdit', 'editLineItem'); });
        it('should open a form dialog', () => {
          componentUnderTest.onNotification({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: { id: 1 } });

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'multiplier' }],
            { title: 'QUOTE.ADD_MULTIPLIER_TITLE', submitLabel: 'QUOTE.ADD_MULTIPLIER_FORM_SUBMIT' },
            jasmine.any(Function)
          );
        });

        it('calls the callback on form submit', () => {
          componentUnderTest.onNotification({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: { id: 1 } });
          mockDialogService.onSubmitCallback({ multiplier: '1.2' });
          expect(quoteFeeSpy).toHaveBeenCalledWith({ id: 1 }, { multiplier: '1.2' });
        });

        it('uses the correct strings for edit and merges form values', () => {
          componentUnderTest.onNotification({ type: 'SHOW_COST_MULTIPLIER_DIALOG', payload: { id: 1, multiplier: 1.5 } });

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'multiplier', value: 1.5 }],
            { title: 'QUOTE.EDIT_MULTIPLIER_TITLE', submitLabel: 'QUOTE.EDIT_MULTIPLIER_FORM_SUBMIT' },
            jasmine.any(Function)
          );
        });
      });

      describe('REMOVE_COST_MULTIPLIER', () => {
        let quoteFeeSpy: jasmine.Spy;
        beforeEach(() => { quoteFeeSpy = mockStore.createActionFactoryMethod('quoteEdit', 'editLineItem'); });
        it('should call the editLineItem method on the api service', () => {
          componentUnderTest.onNotification({ type: 'REMOVE_COST_MULTIPLIER', payload: { id: 1, multiplier: 2 } });

          expect(quoteFeeSpy).toHaveBeenCalledWith({ id: 1, multiplier: 2 }, { multiplier: 1 });
        });
      });

      describe('ADD_CUSTOM_PRICE', () => {
        beforeEach(() => {
          componentUnderTest.onNotification({ type: 'ADD_CUSTOM_PRICE', payload: { some: 'lineItem', grossAssetPrice: 100 } });
        });

        it('should open up a form dialog with the right config', () => {
          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ name: 'price', label: 'Price', value: '100', type: 'number', min: '0', validation: 'GREATER_THAN' }],
            { title: 'QUOTE.ADD_CUSTOM_PRICE_TITLE', submitLabel: 'QUOTE.ADD_CUSTOM_PRICE_SUBMIT', autocomplete: 'off' },
            jasmine.any(Function)
          );
        });

        it('should dispatch the proper action on form submit', () => {
          mockDialogService.onSubmitCallback({ price: 10 });

          mockStore.expectDispatchFor(addCustomPriceDispatchSpy, { some: 'lineItem', grossAssetPrice: 100 }, 10);
        });
      });

      describe('GO_TO_NEXT_TAB', () => {
        it('Should call the parent class method goToNextTab()', () => {
          spyOn(componentUnderTest, 'goToNextTab');
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          expect(componentUnderTest.goToNextTab).toHaveBeenCalled();
        });
      });

      describe('OPEN_DELETE_DIALOG', () => {
        it('Should forward the message upwards with notify()', () => {
          spyOn(componentUnderTest.notify, 'emit');
          componentUnderTest.onNotification({ type: 'OPEN_DELETE_DIALOG' });

          expect(componentUnderTest.notify.emit).toHaveBeenCalledWith({ type: 'OPEN_DELETE_DIALOG' });
        });
      });

      describe('SAVE_AND_NEW', () => {
        it('Should forward the message upwards with notify()', () => {
          spyOn(componentUnderTest.notify, 'emit');
          componentUnderTest.onNotification({ type: 'SAVE_AND_NEW' });

          expect(componentUnderTest.notify.emit).toHaveBeenCalledWith({ type: 'SAVE_AND_NEW' });
        });
      });

      describe('CLONE_QUOTE', () => {
        it('Should forward the message upwards with notify()', () => {
          spyOn(componentUnderTest.notify, 'emit');
          componentUnderTest.onNotification({ type: 'CLONE_QUOTE' });

          expect(componentUnderTest.notify.emit).toHaveBeenCalledWith({ type: 'CLONE_QUOTE' });
        });
      });

      describe('ADD_PROJECT', () => {
        let addProjectSpy: jasmine.Spy;
        beforeEach(() => { addProjectSpy = mockStore.createActionFactoryMethod('quoteEdit', 'addProject'); });
        it('Should forward the message upwards with notify()', () => {

          componentUnderTest.onNotification({ type: 'ADD_PROJECT' });
          expect(addProjectSpy).toHaveBeenCalled();
        });
      });

      describe('REMOVE_PROJECT', () => {
        let removeProjectSpy: jasmine.Spy;
        beforeEach(() => { removeProjectSpy = mockStore.createActionFactoryMethod('quoteEdit', 'removeProject'); });
        it('Should forward the message upwards with notify()', () => {

          componentUnderTest.onNotification({ type: 'REMOVE_PROJECT', payload: { id: 1 } });
          expect(removeProjectSpy).toHaveBeenCalledWith(1);
        });
      });

      describe('UPDATE_PROJECT', () => {
        let updateProjectSpy: jasmine.Spy;
        let mockProject: Pojo;
        beforeEach(() => {
          updateProjectSpy = mockStore.createActionFactoryMethod('quoteEdit', 'updateProject');
          mockProject = { project: { id: 1 }, items: ['test item'] };
          componentUnderTest.onNotification({ type: 'UPDATE_PROJECT', payload: mockProject });
        });

        it('should open up a form dialog with the right config', () => {
          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(['test item'],
            {
              dialogConfig: { position: { top: '10%' }, disableClose: false },
              title: 'CART.PROJECTS.FORM.TITLE',
              submitLabel: 'CART.PROJECTS.FORM.SUBMIT_LABEL',
              autocomplete: 'off'
            },
            jasmine.any(Function)
          );
        });

        it('should dispatch the proper action on form submit', () => {
          mockDialogService.onSubmitCallback(['test item 2']);
          mockStore.expectDispatchFor(updateProjectSpy, Object.assign({ id: 1 }, ['test item 2']));
        });
      });

      describe('MOVE_LINE_ITEM', () => {
        let moveLineItemSpy: jasmine.Spy;
        beforeEach(() => { moveLineItemSpy = mockStore.createActionFactoryMethod('quoteEdit', 'moveLineItem'); });
        it('Should forward the message upwards with notify()', () => {
          let mockProject = { otherProject: 'other project', lineItem: 'lineItemtoMove' };
          componentUnderTest.onNotification({ type: 'MOVE_LINE_ITEM', payload: mockProject });
          expect(moveLineItemSpy).toHaveBeenCalledWith('other project', 'lineItemtoMove');
        });
      });

      describe('CLONE_LINE_ITEM', () => {
        let cloneLineItemSpy: jasmine.Spy;
        beforeEach(() => { cloneLineItemSpy = mockStore.createActionFactoryMethod('quoteEdit', 'cloneLineItem'); });
        it('Should forward the message upwards with notify()', () => {
          let mockLineItem = {};
          componentUnderTest.onNotification({ type: 'CLONE_LINE_ITEM', payload: mockLineItem });
          expect(cloneLineItemSpy).toHaveBeenCalledWith(mockLineItem);
        });
      });

      describe('REMOVE_LINE_ITEM', () => {
        let removeLineItemSpy: jasmine.Spy;
        beforeEach(() => { removeLineItemSpy = mockStore.createActionFactoryMethod('quoteEdit', 'removeAsset'); });
        it('Should forward the message upwards with notify()', () => {
          let mockLineItem = { asset: { id: 1 } };
          componentUnderTest.onNotification({ type: 'REMOVE_LINE_ITEM', payload: mockLineItem });
          expect(removeLineItemSpy).toHaveBeenCalledWith(mockLineItem.asset);
        });
      });

      describe('EDIT_LINE_ITEM', () => {
        let editLineItemSpy: jasmine.Spy;
        beforeEach(() => { editLineItemSpy = mockStore.createActionFactoryMethod('quoteEdit', 'editLineItem'); });
        it('Should forward the message upwards with notify()', () => {
          let mockLineItem = { fieldToEdit: { field: 2 }, lineItem: { testItem: 1 } };
          componentUnderTest.onNotification({ type: 'EDIT_LINE_ITEM', payload: mockLineItem });
          expect(editLineItemSpy).toHaveBeenCalledWith(mockLineItem.lineItem, mockLineItem.fieldToEdit);
        });
      });

      describe('EDIT_LINE_ITEM_MARKERS', () => {
        it('edits the assets in and out markers with EDIT_LINE_ITEM_MARKERS', () => {
          let mockAsset = { assetId: 1234 };
          let mockMethod = mockStore.createLegacyServiceMethod('asset', 'getClipPreviewData', Observable.of({ url: 'fake url' }));

          componentUnderTest.onNotification({ type: 'EDIT_LINE_ITEM_MARKERS', payload: { asset: mockAsset } });

          mockStore.expectCallFor(mockMethod, 1234);
        });
      });

      describe('SHOW_PRICING_DIALOG', () => {


        it('calls openPricingDialog with SHOW_PRICING_DIALOG', () => {
          let mockLineItem = { asset: { assetId: 123456 } };
          componentUnderTest.ngOnInit();
          componentUnderTest.onNotification({ type: 'SHOW_PRICING_DIALOG', payload: mockLineItem });

          mockStore.expectDispatchFor(initPricingSpy, 'Rights Managed', {
            componentType: jasmine.any(Function),
            inputOptions: {
              pricingPreferences: { some: 'attribute' },
              userCanCustomizeRights: false
            },
            outputOptions: [
              {
                event: 'pricingEvent',
                callback: jasmine.any(Function)
              }
            ]
          });
        });
      });

      describe('EDIT_PROJECT_PRICING', () => {
        it('edits the project pricing with EDIT_PROJECT_PRICING', () => {
          let mockAsset = { assetId: 1234 };
          componentUnderTest.ngOnInit();
          componentUnderTest.onNotification({ type: 'EDIT_PROJECT_PRICING', payload: { asset: mockAsset } });

          mockStore.expectDispatchFor(setPriceSpy, null);
          mockStore.expectDispatchFor(initPricingSpy, 'Rights Managed', {
            componentType: jasmine.any(Function),
            inputOptions: {
              pricingPreferences: { some: 'attribute' },
              userCanCustomizeRights: false
            },
            outputOptions: [
              {
                event: 'pricingEvent',
                callback: jasmine.any(Function)
              }
            ]
          });
        });
      });
    });

    describe('get showUsageWarning()', () => {

      it('Should show the usage warning if the cart has assets but userCanProceed is false', () => {
        mockStore.createStateSection('quoteEdit', {
          data: {
            itemCount: 2,
            projects: [{
              lineItems: [
                { id: '2', price: 100, rightsManaged: 'Rights Managed' },
              ]
            }]
          }
        });
        componentUnderTest.quoteType = 'BadDebt';
        expect(componentUnderTest.showUsageWarning).toBe(true);
      });

      it('Should not show the usage warning if the user has no assets in the cart', () => {
        mockStore.createStateSection('quoteEdit', { data: { itemCount: 0 } });
        expect(componentUnderTest.showUsageWarning).toBe(false);
      });

      it('Should not show the usage warning if the user has assess and userCanProceed is true', () => {
        mockStore.createStateSection('quoteEdit', {
          data: {
            itemCount: 2,
            projects: [{
              lineItems: [
                { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
              ]
            }]
          }
        });
        componentUnderTest.quoteType = 'Trial';
        expect(componentUnderTest.showUsageWarning).toBe(false);
      });
    });

    describe('get userCanProceed()', () => {
      it('Should return true if component quoteType is Trial', () => {
        componentUnderTest.quoteType = 'Trial';
        expect(componentUnderTest.userCanProceed).toBe(true);
      });
      it(`Should return true if component quoteType is not Trial but 
      the cart has assets and all right managed assets have rights packages`, () => {
          componentUnderTest.quoteType = 'BadDebt';
          mockStore.createStateSection('quoteEdit', {
            data: {
              itemCount: 1,
              projects: [{
                lineItems: [
                  { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                  { id: '2', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                  { id: '3', price: 59, rightsManaged: 'Royalty Free' }
                ]
              }, {}]
            }
          });
          expect(componentUnderTest.userCanProceed).toBe(true);
        });

      it(`Should return true if component quoteType is not Trial but 
        the cart has assets and none are rights managed`, () => {
          componentUnderTest.quoteType = 'BadDebt';
          mockStore.createStateSection('quoteEdit', {
            data: {
              itemCount: 1,
              projects: [{
                lineItems: [
                  { id: '1', price: 100, rightsManaged: 'Royalty Free' },
                  { id: '2', price: 100, rightsManaged: 'Royalty Free' },
                  { id: '3', price: 59, rightsManaged: 'Royalty Free' }
                ]
              }, {}]
            }
          });
          expect(componentUnderTest.userCanProceed).toBe(true);
        });

      it(`Should return false if component quoteType is not Trial and 
        the cart has assets but not all right managed assets have rights packages`, () => {
          componentUnderTest.quoteType = 'BadDebt';
          mockStore.createStateSection('quoteEdit', {
            data: {
              itemCount: 1,
              projects: [{
                lineItems: [
                  { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                  { id: '2', price: 100, rightsManaged: 'Rights Managed' },
                  { id: '3', price: 59, rightsManaged: 'Royalty Free' }
                ]
              }, {}]
            }
          });
          expect(componentUnderTest.userCanProceed).toBe(false);
        });

      it('Should return false if component quoteType is not Trial and the cart has no assets', () => {
        componentUnderTest.quoteType = 'BadDebt';
        mockStore.createStateSection('quoteEdit', { data: { itemCount: 0 } });
        expect(componentUnderTest.userCanProceed).toBe(false);
      });

      it('Should return false if component quoteType is not Trial and the cart has rights managed assets with no attributes', () => {
        componentUnderTest.quoteType = 'BadDebt';
        mockStore.createStateSection('quoteEdit', {
          data: {
            itemCount: 3,
            projects: [{
              lineItems: [
                { id: '1', price: 100, attributes: ['a', 'b', 'c'], rightsManaged: 'Rights Managed' },
                { id: '2', price: 100, rightsManaged: 'Rights Managed' },
                { id: '3', price: 59, rightsManaged: 'Royalty Free' }
              ]
            }]
          }
        });
        expect(componentUnderTest.userCanProceed).toBe(false);
      });
    });

    describe('get total()', () => {
      it('Should return the current total dollar amount for the quote', () => {
        mockStore.createStateSection('quoteEdit', { data: { total: 1000 } });
        let currentTotal: number;
        componentUnderTest.total.subscribe(total => currentTotal = total);
        expect(currentTotal).toBe(1000);
      });
    });

    describe('get subTotal()', () => {
      it('Should return the current subTotal dollar amount for the quote', () => {
        mockStore.createStateSection('quoteEdit', { data: { subTotal: 1000 } });
        let currentSubTotal: number;
        componentUnderTest.subTotal.subscribe(total => currentSubTotal = total);
        expect(currentSubTotal).toBe(1000);
      });
    });

    describe('get discount()', () => {
      it('Should return the current discount dollar amount for the quote', () => {
        mockStore.createStateSection('quoteEdit', { data: { discount: '1000' } });
        let currentDiscount: string;
        componentUnderTest.discount.subscribe(total => currentDiscount = total);
        expect(currentDiscount).toBe('1000');
      });
    });

    describe('get quoteIsTrial()', () => {
      it('Should return true if purchaseType is Trial', () => {
        mockStore.createStateSection('quoteEdit', { data: { purchaseType: 'Trial' } });
        let purchaseType;
        componentUnderTest.quoteIsTrial.subscribe((response) => purchaseType = response);
        expect(purchaseType).toBe(true);
      });
    });

    describe('get cartContainsNoAssets()', () => {
      it('Should return true if cart has no assets', () => {
        mockStore.createStateSection('quoteEdit', { data: { itemCount: 0 } });
        expect(componentUnderTest.cartContainsAssets).toBe(false);
      });

      it('Should return false if cart has assets', () => {
        mockStore.createStateSection('quoteEdit', { data: { itemCount: 1 } });
        expect(componentUnderTest.cartContainsAssets).toBe(true);
      });
    });

    describe('showDiscount()', () => {
      describe('returns false', () => {
        it('when the quote does not have the property', () => {
          mockStore.createStateSection('quoteEdit', { data: {} });
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "Trial" and the quote DOES NOT have the property', () => {
          mockStore.createStateSection('quoteEdit', { data: {} });
          componentUnderTest.quoteType = 'Trial';
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "Trial" and the quote DOES have the property', () => {
          mockStore.createStateSection('quoteEdit', { data: { discount: '100' } });
          componentUnderTest.quoteType = 'Trial';
          expect(componentUnderTest.showDiscount).toBe(false);
        });
      });

      describe('returns true', () => {
        it('when the quote does have the property AND the quoteType is null (indicates "Standard" quote)', () => {
          mockStore.createStateSection('quoteEdit', { data: { discount: '100' } });
          componentUnderTest.quoteType = null;
          expect(componentUnderTest.showDiscount).toBe(true);
        });

        it('when the quote does have the property AND the quoteType is NOT Trial', () => {
          mockStore.createStateSection('quoteEdit', { data: { discount: '100' } });
          componentUnderTest.quoteType = 'NotTrial' as any;
          expect(componentUnderTest.showDiscount).toBe(true);
        });
      });
    });

    describe('shouldShowCloneButton()', () => {
      it('Should call the cloneQuote capability with the quote edit store', () => {
        mockStore.createStateSection('quoteEdit', { data: { id: 1 } });
        const shouldShowCloneButton = componentUnderTest.shouldShowCloneButton;
        expect(mockCapabilities.cloneQuote).toHaveBeenCalledWith(Observable.of({ data: { id: 1 } }));
      });
    });

    describe('purchaseTypeConfig getter', () => {
      it('returns the config', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.purchaseTypeConfig).toEqual([{ value: 'SystemLicense', viewValue: 'System License' }]);
      });
    });

    describe('onSelectQuoteType()', () => {
      it('should set the quoteType instance variable', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.onSelectQuoteType({ type: 'Trial' });

        expect(componentUnderTest.quoteType).toBe('Trial');
      });

      it('should update the createQuote form config', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.onSelectQuoteType({ type: 'SystemLicense' });

        expect(componentUnderTest.config.createQuote.items).toEqual([{ name: 'purchaseType', value: 'System License' }]);
      });
    });

    describe('onOpenBulkImportDialog()', () => {
      let bulkImportSpy: jasmine.Spy;
      beforeEach(() => {
        componentUnderTest.ngOnInit();
        componentUnderTest.onNotification({ type: 'OPEN_BULK_IMPORT_DIALOG', payload: 'abcd-1234' });
        bulkImportSpy = mockStore.createActionFactoryMethod('quoteEdit', 'bulkImport');
      });

      it('opens a form dialog', () => {
        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          [{ some: 'import' }],
          { title: 'QUOTE.BULK_IMPORT.TITLE', submitLabel: 'QUOTE.BULK_IMPORT.SUBMIT_BTN', autocomplete: 'off' },
          jasmine.any(Function)
        );
      });

      it('calls the bulkImport() on the quote edit service in the callback', () => {
        mockDialogService.onSubmitCallback({ lineItemAttributes: 'one\ntwo' });

        expect(bulkImportSpy).toHaveBeenCalledWith({ lineItemAttributes: 'one\ntwo' }, 'abcd-1234');
      });
    });
  });
}
