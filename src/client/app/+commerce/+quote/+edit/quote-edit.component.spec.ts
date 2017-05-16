import { QuoteEditComponent } from './quote-edit.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Edit Component', () => {
    let componentUnderTest: QuoteEditComponent, mockCapabilities: any, mockQuoteEditService: any, mockUiConfig: any,
      mockDialogService: any, mockAssetService: any, mockWindow: any, mockUserPreference: any,
      mockErrorStore: any, mockDocument: any, mockSnackbar: any, mockTranslateService: any;

    beforeEach(() => {
      mockQuoteEditService = {
        addFeeTo: jasmine.createSpy('addFeeTo'),
        removeFee: jasmine.createSpy('removeFee'),
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of('someProp')),
        updateQuoteField: jasmine.createSpy('updateQuoteField'),
        sendQuote: jasmine.createSpy('sendQuote').and.returnValue(Observable.of({})),
        editLineItem: jasmine.createSpy('editLineItem')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({
          config: {
            createQuote: { items: ['yay'] },
            addBulkOrderId: { items: [{ some: 'bulk' }] },
            addDiscount: { items: [{ some: 'discount' }] },
            addCostMultiplier: { items: [{ some: 'multiplier' }] }
          }
        }))
      };

      mockDialogService = {
        openFormDialog: jasmine.createSpy('openFormDialog').and.callFake((_: any, __: any, onSubmitCallback: Function) => {
          mockDialogService.onSubmitCallback = onSubmitCallback;
        })
      };

      mockUserPreference = { data: Observable.of({ pricingPreferences: { some: 'preference' } }) };

      mockSnackbar = { open: jasmine.createSpy('open') };

      mockTranslateService = { get: jasmine.createSpy('createQuote').and.returnValue(Observable.of('')) };

      componentUnderTest =
        new QuoteEditComponent(
          mockCapabilities, mockQuoteEditService, mockUiConfig, mockDialogService, mockAssetService,
          mockWindow, mockUserPreference, mockErrorStore, mockDocument, mockSnackbar, mockTranslateService,
          null
        );
    });

    // This gets used down below for some tedious setup in the editBulkId and editDiscount blocks
    let setupFor = (propertyInQuestion: any) => {
      mockQuoteEditService = {
        hasProperty: jasmine.createSpy('hasProperty').and.returnValue(Observable.of(propertyInQuestion)),
        updateQuoteField: jasmine.createSpy('updateQuoteField')
      };
      componentUnderTest = new QuoteEditComponent(
        null, mockQuoteEditService, mockUiConfig, mockDialogService, null, null, mockUserPreference, null, null, null, null, null
      );
      return componentUnderTest;
    };

    describe('Constructor', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('sets up the config instance variable', () => {
        expect(componentUnderTest.config).toEqual({
          createQuote: { items: ['yay'] },
          addBulkOrderId: { items: [{ some: 'bulk' }] },
          addDiscount: { items: [{ some: 'discount' }] },
          addCostMultiplier: { items: [{ some: 'multiplier' }] }
        });
      });
    });

    describe('onNotification()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('OPEN_QUOTE_DIALOG', () => {
        it('calls openFormDialog() on the dialogService with the proper args', () => {
          componentUnderTest.onNotification({ type: 'OPEN_QUOTE_DIALOG' });

          expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
            ['yay'],
            { title: 'QUOTE.CREATE_HEADER', submitLabel: 'QUOTE.SEND_BTN', autocomplete: 'off' },
            jasmine.any(Function)
          );
        });

        it('calls the callback on form submit', () => {
          componentUnderTest.quoteType = 'ProvisionalOrder';
          componentUnderTest.onNotification({ type: 'OPEN_QUOTE_DIALOG' });
          mockDialogService.onSubmitCallback({ emailAddress: 'ross.edfort@wazeedigital.com', expirationDate: '2017/05/03' });
          expect(mockQuoteEditService.sendQuote).toHaveBeenCalledWith({
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-05-03T06:00:00.000Z',
            purchaseType: 'ProvisionalOrder'
          });
        });
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
