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
    let mockQuoteEditService: any;
    let mockDialogService: any;
    let mockWindow: any;
    let mockUserPreference: any;
    let mockRouter: any;
    let mockDocument: any;
    let mockPricingService: any;

    beforeEach(() => {
      mockCapabilities = {
        cloneQuote: jasmine.createSpy('cloneQuote')
      };

      mockQuoteEditService = {
        state: { data: 'store' },
        data: Observable.of({ data: { purchaseType: 'Trial' } }),
        projects: Observable.of([]),
        quoteId: 1,
        addFeeTo: jasmine.createSpy('addFeeTo'),
        removeFee: jasmine.createSpy('removeFee'),
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of('someProp')),
        updateQuoteField: jasmine.createSpy('updateQuoteField'),
        sendQuote: jasmine.createSpy('sendQuote').and.returnValue(Observable.of({})),
        editLineItem: jasmine.createSpy('editLineItem'),
        createQuote: jasmine.createSpy('createQuote').and.returnValue(Observable.of({})),
        cloneQuote: jasmine.createSpy('cloneQuote').and.returnValue(Observable.of({})),
        bulkImport: jasmine.createSpy('bulkImport').and.returnValue(Observable.of({}))
      };

      mockDialogService = {
        openFormDialog: jasmine.createSpy('openFormDialog').and.callFake((_: any, __: any, onSubmitCallback: Function) => {
          mockDialogService.onSubmitCallback = onSubmitCallback;
        }),
        openConfirmationDialog: jasmine.createSpy('openConfirmationDialog').and.callFake((_: any, onAcceptCallback: Function) => {
          mockDialogService.onAcceptCallback = onAcceptCallback;
        })
      };

      mockUserPreference = { data: Observable.of({ pricingPreferences: { some: 'preference' } }) };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      mockPricingService = {
        getPriceFor: jasmine.createSpy('getPriceFor'),
        getPriceAttributes: jasmine.createSpy('getPricingAttributes')
      };

      mockStore = new MockAppStore();

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
          mockCapabilities, mockQuoteEditService, mockDialogService,
          mockWindow, mockUserPreference, mockDocument, null, mockRouter, mockStore, mockPricingService
        );
    });

    // This gets used down below for some tedious setup in the editBulkId and editDiscount blocks
    let setupFor = (propertyInQuestion: any) => {
      mockQuoteEditService = {
        projects: Observable.of([]),
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of(propertyInQuestion)),
        updateQuoteField: jasmine.createSpy('updateQuoteField'),
        quoteId: 1
      };
      componentUnderTest = new QuoteEditTabComponent(
        mockCapabilities, mockQuoteEditService, mockDialogService,
        mockWindow, mockUserPreference, mockDocument, null, mockRouter, mockStore, mockPricingService
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
        it('calls the addFeeTo() service method', () => {
          componentUnderTest.onNotification(
            { type: 'ADD_QUOTE_FEE', payload: { project: { some: 'project' }, fee: { some: 'fee' } } }
          );

          expect(mockQuoteEditService.addFeeTo).toHaveBeenCalledWith({ some: 'project' }, { some: 'fee' });
        });

        it('throws an error if the message doesn\'t have a payload', () => {
          expect(() => componentUnderTest.onNotification({ type: 'ADD_QUOTE_FEE' })).toThrowError();
        });
      });

      describe('REMOVE_QUOTE_FEE', () => {
        it('calls the removeFee() service method', () => {
          componentUnderTest.onNotification(
            { type: 'REMOVE_QUOTE_FEE', payload: { some: 'fee' } }
          );

          expect(mockQuoteEditService.removeFee).toHaveBeenCalledWith({ some: 'fee' });
        });
      });

      describe('SHOW_COST_MULTIPLIER_DIALOG', () => {
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
          expect(mockQuoteEditService.editLineItem).toHaveBeenCalledWith({ id: 1 }, { multiplier: '1.2' });
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
        it('should call the editLineItem method on the api service', () => {
          componentUnderTest.onNotification({ type: 'REMOVE_COST_MULTIPLIER', payload: { id: 1, multiplier: 2 } });

          expect(mockQuoteEditService.editLineItem).toHaveBeenCalledWith({ id: 1, multiplier: 2 }, { multiplier: 1 });
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

      describe('DEFAULT', () => {
        it('Should call the parent class default onNotifcation because no case matches', () => {
          spyOn(CommerceEditTab.prototype, 'onNotification');
          componentUnderTest.onNotification({ type: 'TEST', payload: { test: 'test' } });
          expect(CommerceEditTab.prototype.onNotification).toHaveBeenCalled();
        });
      });
    });

    describe('get quoteIsTrial()', () => {
      it('Should return true if purchaseType is Trial', () => {
        let purchaseType;
        componentUnderTest.quoteIsTrial.subscribe((response) => purchaseType = response);
        expect(purchaseType).toBe(true);
      });
    });

    describe('showDiscount()', () => {
      describe('returns false', () => {
        it('when the quote does not have the property', () => {
          componentUnderTest = setupFor(undefined);
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "Trial" and the quote DOES NOT have the property', () => {
          componentUnderTest = setupFor(undefined);
          componentUnderTest.quoteType = 'Trial';
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "Trial" and the quote DOES have the property', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = 'Trial';
          expect(componentUnderTest.showDiscount).toBe(false);
        });
      });

      describe('returns true', () => {
        it('when the quote does have the property AND the quoteType is null (indicates "Standard" quote)', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = null;
          expect(componentUnderTest.showDiscount).toBe(true);
        });

        it('when the quote does have the property AND the quoteType is NOT Trial', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = 'NotTrial' as any;
          expect(componentUnderTest.showDiscount).toBe(true);
        });
      });
    });

    describe('shouldShowCloneButton()', () => {
      it('Should call the cloneQuote capability with the quote edit store', () => {
        const shouldShowCloneButton = componentUnderTest.shouldShowCloneButton;
        expect(mockCapabilities.cloneQuote).toHaveBeenCalledWith(mockQuoteEditService.data);
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
      beforeEach(() => {
        componentUnderTest.ngOnInit();
        componentUnderTest.onNotification({ type: 'OPEN_BULK_IMPORT_DIALOG', payload: 'abcd-1234' });
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

        expect(mockQuoteEditService.bulkImport).toHaveBeenCalledWith({ lineItemAttributes: 'one\ntwo' }, 'abcd-1234');
      });

      it('displays a snackbar in the callback', () => {
        mockDialogService.onSubmitCallback({ lineItemAttributes: 'one\ntwo' });

        expect(snackbarSpy).toHaveBeenCalledWith('QUOTE.BULK_IMPORT.CONFIRMATION', { numOfAssets: 2 });
      });
    });
  });
}
