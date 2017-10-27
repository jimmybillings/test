import { QuoteEditComponent } from './quote-edit.component';
import { Observable } from 'rxjs/Observable';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Quote Edit Component', () => {
    let componentUnderTest: QuoteEditComponent;
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
    let mockChangeDetectorRef: any;

    beforeEach(() => {
      mockCapabilities = {
        cloneQuote: jasmine.createSpy('cloneQuote')
      };

      mockQuoteEditService = {
        state: { data: 'store' },
        data: { store: 'test data' },
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

      mockChangeDetectorRef = { markForCheck: () => { } };

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
        new QuoteEditComponent(
          mockCapabilities, mockQuoteEditService, mockDialogService, mockStore, mockChangeDetectorRef
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
      componentUnderTest = new QuoteEditComponent(
        mockCapabilities, mockQuoteEditService, mockDialogService, mockStore, mockChangeDetectorRef
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

      it('sets up the commentParentObject instance variable', () => {
        expect(componentUnderTest.commentParentObject).toEqual({ objectType: 'quote', objectId: 1 });
      });

      it('gets the UI config specifically for the comments', () => {
        expect(componentUnderTest.commentFormConfig).toEqual([{ some: 'config' }]);
      });
    });

    describe('Initialization', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('defines the expected tabs', () => {
        expect(componentUnderTest.tabLabelKeys).toEqual(['active quote', 'send']);
      });

      it('disables all but the first tab', () => {
        expect(componentUnderTest.tabEnabled).toEqual([true, false]);
      });

      it('selects the first tab', () => {
        expect(componentUnderTest.selectedTabIndex).toBe(0);
      });
    });

    describe('onNotification()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('OPEN_DELETE_DIALOG', () => {
        beforeEach(() => componentUnderTest.onNotification({ type: 'OPEN_DELETE_DIALOG' }));
        it('calls openConfirmationDialog() on the dialog service', () => {

          expect(mockDialogService.openConfirmationDialog).toHaveBeenCalledWith({
            title: 'QUOTE.DELETE.TITLE',
            message: 'QUOTE.DELETE.MESSAGE',
            accept: 'QUOTE.DELETE.ACCEPT',
            decline: 'QUOTE.DELETE.DECLINE'
          }, jasmine.any(Function));
        });

        describe('onAccept callback', () => {
          beforeEach(() => {
            mockDialogService.onAcceptCallback();
          });

          it('dispatches the correct action', () => {
            mockStore.expectDispatchFor(deleteQuoteDispatchSpy);
          });
        });
      });

      describe('SAVE_AND_NEW', () => {
        beforeEach(() => componentUnderTest.onNotification({ type: 'SAVE_AND_NEW' }));
        it('Calls the quote service createQuote method', () => {

          expect(mockQuoteEditService.createQuote).toHaveBeenCalled();
        });

        it('Shows a snack bar after creating a quote', () => {

          expect(snackbarSpy).toHaveBeenCalledWith('QUOTE.QUOTE_CREATED_PREVIOUS_SAVED');
        });
      });

      describe('CLONE_QUOTE', () => {
        beforeEach(() => componentUnderTest.onNotification({ type: 'CLONE_QUOTE' }));
        it('Calls the quote service createQuote method', () => {
          expect(mockQuoteEditService.cloneQuote).toHaveBeenCalledWith('store');
        });

        it('Shows a snack bar after creating a quote', () => {
          expect(snackbarSpy).toHaveBeenCalledWith('QUOTE.CLONE_SUCCESS');
        });
      });

      describe('GO_TO_NEXT_TAB', () => {
        it('enables the next tab, but no others', () => {
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          expect(componentUnderTest.tabEnabled).toEqual([true, true]);
        });

        it('selects the next tab', (done) => {
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          setTimeout(_ => {
            expect(componentUnderTest.selectedTabIndex).toBe(1);
            done();
          }, 100);
        });

        it('does not advance beyond the last tab', (done) => {
          componentUnderTest.selectedTabIndex = 2;
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          setTimeout(_ => {
            expect(componentUnderTest.selectedTabIndex).toBe(2);
            done();
          }, 100);
        });
      });

      describe('GO_TO_PREVIOUS_TAB', () => {
        it('selects the previous tab', () => {
          componentUnderTest.selectedTabIndex = 1;

          componentUnderTest.onNotification({ type: 'GO_TO_PREVIOUS_TAB' });

          expect(componentUnderTest.selectedTabIndex).toBe(0);
        });

        it('does not go back beyond the first tab', () => {
          componentUnderTest.selectedTabIndex = 0;

          componentUnderTest.onNotification({ type: 'GO_TO_PREVIOUS_TAB' });

          expect(componentUnderTest.selectedTabIndex).toBe(0);
        });
      });

      describe('GO_TO_TAB', () => {
        it('selects the tab by index', () => {
          componentUnderTest.selectedTabIndex = 1;

          componentUnderTest.onNotification({ type: 'GO_TO_TAB', payload: 0 });
          expect(componentUnderTest.selectedTabIndex).toBe(0);
        });
      });

      describe('DISABLE_TAB', () => {
        it('disables a tab based on index', () => {
          componentUnderTest.selectedTabIndex = 1;

          componentUnderTest.onNotification({ type: 'DISABLE_TAB', payload: 0 });
          expect(componentUnderTest.tabEnabled).toEqual([false, false]);
        });
      });
    });

    describe('toggleCommentVisibility', () => {
      it('should toggle the showComments flag', () => {
        expect(componentUnderTest.showComments).toBe(null);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(true);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(false);
      });
    });

    describe('get bulkOrderIdActionLabel', () => {
      it('returns the right string for a known property (EDIT)', () => {
        componentUnderTest = setupFor('someKnownProperty');
        expect(componentUnderTest.bulkOrderIdActionLabel).toBe('QUOTE.EDIT_BULK_ORDER_ID_TITLE');
      });

      it('returns the right string for an unknown property (ADD)', () => {
        componentUnderTest = setupFor(undefined);
        expect(componentUnderTest.bulkOrderIdActionLabel).toBe('QUOTE.ADD_BULK_ORDER_ID_TITLE');
      });
    });

    describe('get discountActionLabel', () => {
      it('returns the right string for a known property (EDIT)', () => {
        componentUnderTest = setupFor('someKnownProperty');
        expect(componentUnderTest.discountActionLabel).toBe('QUOTE.EDIT_DISCOUNT_TITLE');
      });

      it('returns the right string for an unknown property (ADD)', () => {
        componentUnderTest = setupFor(undefined);
        expect(componentUnderTest.discountActionLabel).toBe('QUOTE.ADD_DISCOUNT_TITLE');
      });
    });

    describe('shouldShowCloneButton()', () => {
      it('Should call the cloneQuote capability with the quote edit store', () => {
        const shouldShowCloneButton = componentUnderTest.shouldShowCloneButton;
        expect(mockCapabilities.cloneQuote).toHaveBeenCalledWith(mockQuoteEditService.data);
      });
    });

    describe('commentCount', () => {
      it('should get the count from the correct part of the store', () => {
        mockStore.createStateSection('comment', { quote: { pagination: { totalCount: 10 } } });

        componentUnderTest.commentCount.take(1).subscribe(count => expect(count).toBe(10));
      });
    });

    describe('addBulkOrderId()', () => {
      describe('calls openFormDialog() on the dialog service with the correct arguments', () => {
        it('for a known property', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.ngOnInit();
          componentUnderTest.addBulkOrderId();

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'bulk', value: 'someKnownProperty' }],
            {
              title: 'QUOTE.EDIT_BULK_ORDER_ID_TITLE',
              submitLabel: 'QUOTE.EDIT_BULK_ORDER_FORM_SUBMIT',
              autocomplete: 'off'
            },
            jasmine.any(Function)
          );
        });

        it('for an unknown property', () => {
          componentUnderTest = setupFor(undefined);
          componentUnderTest.ngOnInit();
          componentUnderTest.addBulkOrderId();

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'bulk', value: '' }],
            {
              title: 'QUOTE.ADD_BULK_ORDER_ID_TITLE',
              submitLabel: 'QUOTE.ADD_BULK_ORDER_FORM_SUBMIT',
              autocomplete: 'off'
            },
            jasmine.any(Function)
          );
        });
      });

      describe('the callback', () => {
        it('gets called', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.ngOnInit();
          componentUnderTest.addBulkOrderId();
          mockDialogService.onSubmitCallback({ some: 'options' });

          expect(mockQuoteEditService.updateQuoteField).toHaveBeenCalledWith({ some: 'options' });
        });
      });
    });

    describe('editDiscount()', () => {
      describe('calls openFormDialog() on the dialog service with the correct arguments', () => {
        it('for a known property', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.ngOnInit();
          componentUnderTest.editDiscount();

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'discount', value: 'someKnownProperty' }],
            {
              title: 'QUOTE.EDIT_DISCOUNT_TITLE',
              submitLabel: 'QUOTE.EDIT_DISCOUNT_FORM_SUBMIT',
              autocomplete: 'off'
            },
            jasmine.any(Function)
          );
        });

        it('for an unknown property', () => {
          componentUnderTest = setupFor(undefined);
          componentUnderTest.ngOnInit();
          componentUnderTest.editDiscount();

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            [{ some: 'discount', value: '' }],
            {
              title: 'QUOTE.ADD_DISCOUNT_TITLE',
              submitLabel: 'QUOTE.ADD_DISCOUNT_FORM_SUBMIT',
              autocomplete: 'off'
            },
            jasmine.any(Function)
          );
        });
      });
    });
  });
}
