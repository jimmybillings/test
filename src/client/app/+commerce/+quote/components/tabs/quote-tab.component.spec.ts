import { QuoteTabComponent } from './quote-tab.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Tab Component', () => {
    let componentUnderTest: QuoteTabComponent, mockQuoteService: any, mockUserCan: any, mockDialogService: any, mockRouter: any,
      mockUiConfig: any, mockData: any, mockQuoteEditService: any, mockSnackBar: any, mockTranslate: any;

    function buildComponent(
      quoteHasAssets: boolean,
      canViewLicenses: boolean,
      canAdministerQuotes: boolean,
      quoteStatus: string = 'ACTIVE'): QuoteTabComponent {
      mockData = { id: 1, quoteStatus: quoteStatus };
      mockQuoteService = {
        data: Observable.of({ data: mockData }),
        projects: Observable.of([]),
        state: { data: mockData },
        getPaymentOptions: jasmine.createSpy('getPaymentOptions'),
        hasAssetLineItems: quoteHasAssets,
        retrieveLicenseAgreements: jasmine.createSpy('retrieveLicenseAgreements').and.returnValue(Observable.of({})),
        mockRouter: { navigate: jasmine.createSpy('navigate') },
        cloneQuote: jasmine.createSpy('cloneQuote').and.returnValue(Observable.of({}))
      };
      mockQuoteEditService = {
        cloneQuote: jasmine.createSpy('cloneQuote').and.returnValue(Observable.of({}))
      };
      mockUserCan = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton').and.returnValue(canViewLicenses),
        administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(canAdministerQuotes),
        cloneQuote: jasmine.createSpy('cloneQuote')
      };

      mockSnackBar = {
        open: jasmine.createSpy('open')
      };

      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of('Quote has been cloned'))
      };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog'),
        openConfirmationDialog: jasmine.createSpy('openConfirmationDialog'),
        openFormDialog: jasmine.createSpy('openFormDialog')
      };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { extendQuote: { items: [{ some: 'config' }] } } }))
      };

      return new QuoteTabComponent(mockQuoteService, mockUserCan, mockDialogService, mockRouter,
        mockUiConfig, mockQuoteEditService, mockSnackBar, mockTranslate);
    }

    describe('checkout()', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should go to the next tab', () => {
        spyOn(componentUnderTest, 'goToNextTab');
        componentUnderTest.checkout();

        expect(componentUnderTest.goToNextTab).toHaveBeenCalled();
      });

      it('should retrieve the payment options', () => {
        componentUnderTest.checkout();

        expect(mockQuoteService.getPaymentOptions).toHaveBeenCalled();
      });
    });

    describe('shouldShowCloneButton()', () => {
      it('Should call the cloneQuote capability with the quote edit store', () => {
        const shouldShowCloneButton = componentUnderTest.shouldShowCloneButton;
        expect(mockUserCan.cloneQuote).toHaveBeenCalledWith(mockQuoteService.data);
      });
    });

    describe('onCloneQuote()', () => {
      it('Calls the quote service createQuote method', () => {
        componentUnderTest.onCloneQuote();

        expect(mockQuoteEditService.cloneQuote).toHaveBeenCalledWith(mockData);
      });

      it('Should navigate to active quote page after cloning a quote', () => {
        componentUnderTest.onCloneQuote();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/activeQuote']);
      });

      it('Should call the translate service with the correct translate key | value', () => {
        componentUnderTest.onCloneQuote();
        expect(mockTranslate.get).toHaveBeenCalledWith('QUOTE.CLONE_SUCCESS', null);
      });

      it('Should open the snackbar with the string response from the translate service', () => {
        componentUnderTest.onCloneQuote();
        expect(mockSnackBar.open).toHaveBeenCalledWith('Quote has been cloned', '', { duration: 2000 });
      });
    });

    describe('shouldShowLicenseDetailsBtn()', () => {
      describe('returns true', () => {
        it('when the user can view licenses AND the quote has asset line items', () => {
          componentUnderTest = buildComponent(true, true, true);

          expect(componentUnderTest.shouldShowLicenseDetailsBtn).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can\'t view licenses', () => {
          componentUnderTest = buildComponent(false, false, true);

          expect(componentUnderTest.shouldShowLicenseDetailsBtn).toBe(false);
        });
      });
    });

    describe('shouldShowExpireQuoteButton', () => {
      describe('returns true', () => {
        it('when the user can administer quotes and the quote is active', () => {
          componentUnderTest = buildComponent(true, true, true);

          expect(componentUnderTest.shouldShowExpireQuoteButton).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can\'t administer quotes', () => {
          componentUnderTest = buildComponent(true, true, false);

          expect(componentUnderTest.shouldShowExpireQuoteButton).toBe(false);
        });

        it('when the quote isn\'t active', () => {
          componentUnderTest = buildComponent(true, true, true, 'CANCELLED');

          expect(componentUnderTest.shouldShowExpireQuoteButton).toBe(false);
        });
      });
    });

    describe('shouldShowCheckoutOptions', () => {
      describe('returns true', () => {
        it('when the user can\'t administer quotes and the quote is active', () => {
          componentUnderTest = buildComponent(true, true, false);

          expect(componentUnderTest.shouldShowCheckoutOptions).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can administer quotes', () => {
          componentUnderTest = buildComponent(true, true, true);

          expect(componentUnderTest.shouldShowCheckoutOptions).toBe(false);
        });

        it('when the quote isn\'t active', () => {
          componentUnderTest = buildComponent(true, true, false, 'EXPIRED');

          expect(componentUnderTest.shouldShowCheckoutOptions).toBe(false);
        });
      });
    });

    describe('shouldShowRejectButton', () => {
      describe('returns true', () => {
        it('when the user can\'t administer quotes', () => {
          componentUnderTest = buildComponent(true, true, false);

          expect(componentUnderTest.shouldShowRejectQuoteButton).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can administer quotes', () => {
          componentUnderTest = buildComponent(true, true, true);

          expect(componentUnderTest.shouldShowRejectQuoteButton).toBe(false);
        });
      });
    });

    describe('shouldShowResendButton', () => {
      describe('returns true', () => {
        it('when the user can administer quotes and the quote is active', () => {
          componentUnderTest = buildComponent(true, true, true);

          expect(componentUnderTest.shouldShowResendButton).toBe(true);
        });

        it('when the user can administer quotes and the quote is expired', () => {
          componentUnderTest = buildComponent(true, true, true, 'EXPIRED');

          expect(componentUnderTest.shouldShowResendButton).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can\'t administer quotes', () => {
          componentUnderTest = buildComponent(true, true, false);

          expect(componentUnderTest.shouldShowResendButton).toBe(false);
        });

        it('when the quote is not expired OR active', () => {
          componentUnderTest = buildComponent(true, true, true, 'CANCELLED');

          expect(componentUnderTest.shouldShowResendButton).toBe(false);
        });
      });
    });

    describe('showLicenseAgreements()', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should call retrieveLicenseAgreements() on the cart service', () => {
        componentUnderTest.showLicenseAgreements();

        expect(mockQuoteService.retrieveLicenseAgreements).toHaveBeenCalled();
      });
    });

    describe('showExpireConfirmationDialog', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should call openConfirmationDialog() on the dialog serice', () => {
        componentUnderTest.showExpireConfirmationDialog();
      });
    });

    describe('openRejectQuoteDialog()', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should call openConfirmationDialog() on the dialog service', () => {
        componentUnderTest.openRejectQuoteDialog();

        expect(mockDialogService.openConfirmationDialog).toHaveBeenCalled();
      });
    });

    describe('openResendDialog()', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should call openFormDialog on the dialog service', () => {
        componentUnderTest.openResendDialog();

        expect(mockDialogService.openFormDialog).toHaveBeenCalledWith(
          [{ some: 'config' }],
          { title: 'QUOTE.EXTEND_EXPIRATION' },
          jasmine.any(Function)
        );
      });
    });

    describe('hasDiscount()', () => {
      beforeEach(() => {
        componentUnderTest = buildComponent(true, true, true);
      });

      it('should return false when discount does NOT exists', () => {
        expect(componentUnderTest.hasDiscount).toBe(false);
      });

      it('should return true if discount has a value', () => {
        let mockState = { data: { discount: 12.0 } };

        mockQuoteService = {
          data: Observable.of({ data: {} }),
          state: mockState,
          projects: Observable.of([])
        };
        componentUnderTest = new QuoteTabComponent(mockQuoteService, null, null, null, mockUiConfig,
          mockQuoteEditService, mockSnackBar, mockTranslate);
        expect(componentUnderTest.hasDiscount).toBe(true);
      });
    });
  });
}
