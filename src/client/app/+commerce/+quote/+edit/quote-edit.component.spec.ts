import { QuoteEditComponent } from './quote-edit.component';
import { Observable } from 'rxjs/Observable';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Quote Edit Component', () => {
    let componentUnderTest: QuoteEditComponent, mockCapabilities: any, mockQuoteEditService: any, mockUiConfig: any,
      mockDialogService: any, mockAssetService: any, mockWindow: any, mockUserPreference: any, mockRouter: any,
      mockErrorStore: any, mockDocument: any, mockSnackbar: any, mockTranslateService: any, mockAppStore: MockAppStore,
      mockCurrentUserService: any;

    beforeEach(() => {
      mockCapabilities = {
        cloneQuote: jasmine.createSpy('cloneQuote')
      };
      mockQuoteEditService = {
        state: { data: 'store' },
        data: { store: 'test data' },
        quoteId: 1,
        addFeeTo: jasmine.createSpy('addFeeTo'),
        removeFee: jasmine.createSpy('removeFee'),
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of('someProp')),
        updateQuoteField: jasmine.createSpy('updateQuoteField'),
        sendQuote: jasmine.createSpy('sendQuote').and.returnValue(Observable.of({})),
        editLineItem: jasmine.createSpy('editLineItem'),
        deleteQuote: jasmine.createSpy('deleteQuote').and.returnValue(Observable.of({})),
        createQuote: jasmine.createSpy('createQuote').and.returnValue(Observable.of({})),
        cloneQuote: jasmine.createSpy('cloneQuote').and.returnValue(Observable.of({})),
        bulkImport: jasmine.createSpy('bulkImport').and.returnValue(Observable.of({}))
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({
          config: {
            form: { items: ['comment', 'stuff'] },
            createQuote: { items: ['yay'] },
            addBulkOrderId: { items: [{ some: 'bulk' }] },
            addDiscount: { items: [{ some: 'discount' }] },
            addCostMultiplier: { items: [{ some: 'multiplier' }] },
            bulkImport: { items: [{ some: 'import' }] }
          }
        }))
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

      mockSnackbar = { open: jasmine.createSpy('open') };

      mockTranslateService = { get: jasmine.createSpy('createQuote').and.returnValue(Observable.of('')) };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      mockCurrentUserService = { data: Observable.of({ id: 10 }) };

      mockAppStore = new MockAppStore();

      componentUnderTest =
        new QuoteEditComponent(
          mockCapabilities, mockQuoteEditService, mockUiConfig, mockDialogService, mockAssetService,
          mockWindow, mockUserPreference, mockErrorStore, mockDocument, mockSnackbar, mockTranslateService,
          null, mockRouter, mockCurrentUserService, mockAppStore
        );
    });

    // This gets used down below for some tedious setup in the editBulkId and editDiscount blocks
    let setupFor = (propertyInQuestion: any) => {
      mockQuoteEditService = {
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of(propertyInQuestion)),
        updateQuoteField: jasmine.createSpy('updateQuoteField')
      };
      componentUnderTest = new QuoteEditComponent(
        null, mockQuoteEditService, mockUiConfig, mockDialogService, null, null,
        mockUserPreference, null, null, null, null, null, mockRouter, mockCurrentUserService, mockAppStore
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
          createQuote: { items: ['yay'] },
          addBulkOrderId: { items: [{ some: 'bulk' }] },
          addDiscount: { items: [{ some: 'discount' }] },
          addCostMultiplier: { items: [{ some: 'multiplier' }] },
          bulkImport: { items: [{ some: 'import' }] }
        });
      });

      it('sets up the commentParentObject instance variable', () => {
        expect(componentUnderTest.commentParentObject).toEqual({
          objectType: 'quote', objectId: 1
        });
      });

      it('gets the UI config specifically for the comments', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('orderableComment');
      });
    });

    describe('onNotification()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('ADD_BULK_ORDER_ID', () => {
        it('calls addBulkOrderId()', () => {
          spyOn(componentUnderTest, 'addBulkOrderId');
          componentUnderTest.onNotification({ type: 'ADD_BULK_ORDER_ID' });
          expect(componentUnderTest.addBulkOrderId).toHaveBeenCalled();
        });
      });

      describe('EDIT_DISCOUNT', () => {
        it('calls editDiscount()', () => {
          spyOn(componentUnderTest, 'editDiscount');
          componentUnderTest.onNotification({ type: 'EDIT_DISCOUNT' });
          expect(componentUnderTest.editDiscount).toHaveBeenCalled();
        });
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

      describe('DEFAULT', () => {
        it('Should call the parent class default onNotifcation because no case matches', () => {
          spyOn(CommerceEditTab.prototype, 'onNotification');
          componentUnderTest.onNotification({ type: 'TEST', payload: { test: 'test' } });
          expect(CommerceEditTab.prototype.onNotification).toHaveBeenCalled();
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

    describe('currentUserId', () => {
      it('returns the current user\'s id', () => {
        componentUnderTest.currentUserId.take(1).subscribe(userId => expect(userId).toBe(10));
      });
    });

    describe('openQuoteDialog', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('calls openFormDialog() on the dialogService with the proper args', () => {
        componentUnderTest.onOpenQuoteDialog();

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          ['yay'],
          { title: 'QUOTE.CREATE_HEADER', submitLabel: 'QUOTE.SEND_BTN', autocomplete: 'off' },
          jasmine.any(Function)
        );
      });

      it('calls the callback on form submit', () => {
        componentUnderTest.quoteType = 'ProvisionalOrder';
        componentUnderTest.onOpenQuoteDialog();
        mockDialogService.onSubmitCallback({ emailAddress: 'ross.edfort@wazeedigital.com', expirationDate: '2017/05/03' });
        expect(mockQuoteEditService.sendQuote).toHaveBeenCalledWith({
          ownerEmail: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017-05-03T06:00:00.000Z',
          purchaseType: 'ProvisionalOrder'
        });
      });

      it('Navigates to the quote detail page on succesfull submit', () => {
        componentUnderTest.quoteType = 'ProvisionalOrder';
        componentUnderTest.onOpenQuoteDialog();
        mockDialogService.onSubmitCallback({ emailAddress: 'ross.edfort@wazeedigital.com', expirationDate: '2017/05/03' });
        expect(mockRouter.navigate).toHaveBeenCalledWith([`/commerce/quotes/1`]);
      });

      it('Shows a success snack bar notification on succesfull submit', () => {
        componentUnderTest.quoteType = 'ProvisionalOrder';
        componentUnderTest.onOpenQuoteDialog();
        spyOn(componentUnderTest, 'showSnackBar');
        mockDialogService.onSubmitCallback({ emailAddress: 'ross.edfort@wazeedigital.com', expirationDate: '2017/05/03' });
        expect(componentUnderTest.showSnackBar).toHaveBeenCalledWith({
          key: 'QUOTE.CREATED_FOR_TOAST',
          value: { emailAddress: 'ross.edfort@wazeedigital.com' }
        });
      });
    });

    describe('openDeleteQuoteDialog()', () => {
      it('calls openConfirmationDialog() on the dialog service', () => {
        componentUnderTest.onOpenDeleteQuoteDialog();

        expect(mockDialogService.openConfirmationDialog).toHaveBeenCalledWith({
          title: 'QUOTE.DELETE.TITLE',
          message: 'QUOTE.DELETE.MESSAGE',
          accept: 'QUOTE.DELETE.ACCEPT',
          decline: 'QUOTE.DELETE.DECLINE'
        }, jasmine.any(Function));
      });

      describe('onAccept callback', () => {
        beforeEach(() => {
          componentUnderTest.onOpenDeleteQuoteDialog();
          mockDialogService.onAcceptCallback();
        });

        it('deletes the quote', () => {
          expect(mockQuoteEditService.deleteQuote).toHaveBeenCalled();
        });

        it('navigates to the correct route', () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/quotes']);
        });
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

    describe('showDiscount()', () => {
      describe('returns false', () => {
        it('when the quote does not have the property', () => {
          componentUnderTest = setupFor(undefined);
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "ProvisionalOrder" and the quote DOES NOT have the property', () => {
          componentUnderTest = setupFor(undefined);
          componentUnderTest.quoteType = 'ProvisionalOrder';
          expect(componentUnderTest.showDiscount).toBe(false);
        });

        it('when the quoteType is "ProvisionalOrder" and the quote DOES have the property', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = 'ProvisionalOrder';
          expect(componentUnderTest.showDiscount).toBe(false);
        });
      });

      describe('returns true', () => {
        it('when the quote does have the property AND the quoteType is null (indicates "Standard" quote)', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = null;
          expect(componentUnderTest.showDiscount).toBe(true);
        });

        it('when the quote does have the property AND the quoteType is NOT provisionalOrder', () => {
          componentUnderTest = setupFor('someKnownProperty');
          componentUnderTest.quoteType = 'OfflineAgreement';
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

    describe('commentCount', () => {
      it('should get the count from the correct part of the store', () => {
        mockAppStore.createStateSection('comment', { quote: { pagination: { totalCount: 10 } } });

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

    describe('onCreateQuote()', () => {
      it('Calls the quote service createQuote method', () => {
        componentUnderTest.onCreateQuote();

        expect(mockQuoteEditService.createQuote).toHaveBeenCalled();
      });

      it('Shows a snack bar after creating a quote', () => {
        spyOn(componentUnderTest, 'showSnackBar');
        componentUnderTest.onCreateQuote();

        expect(componentUnderTest.showSnackBar).toHaveBeenCalledWith({
          key: 'QUOTE.QUOTE_CREATED_PREVIOUS_SAVED',
          value: null
        });
      });
    });

    describe('onCloneQuote()', () => {
      it('Calls the quote service createQuote method', () => {
        componentUnderTest.onCloneQuote();

        expect(mockQuoteEditService.cloneQuote).toHaveBeenCalledWith('store');
      });

      it('Shows a snack bar after creating a quote', () => {
        spyOn(componentUnderTest, 'showSnackBar');
        componentUnderTest.onCloneQuote();

        expect(componentUnderTest.showSnackBar).toHaveBeenCalledWith({
          key: 'QUOTE.CLONE_SUCCESS',
          value: null
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

      it('calls the showSnackBar() in the callback', () => {
        spyOn(componentUnderTest, 'showSnackBar');
        mockDialogService.onSubmitCallback({ lineItemAttributes: 'one\ntwo' });

        expect(componentUnderTest.showSnackBar).toHaveBeenCalledWith({
          key: 'QUOTE.BULK_IMPORT.CONFIRMATION',
          value: { numOfAssets: 2 }
        });
      });
    });
  });
}
