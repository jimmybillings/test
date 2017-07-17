import { QuoteTabComponent } from './quote-tab.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Tab Component', () => {
    let componentUnderTest: QuoteTabComponent, mockQuoteService: any, mockUserCan: any, mockDialogService: any, mockRouter: any,
      mockUiConfig: any, mockData: any;

    function buildComponent(
      quoteHasAssets: boolean,
      canViewLicenses: boolean,
      canAdministerQuotes: boolean,
      quoteStatus: string = 'ACTIVE'): QuoteTabComponent {
      mockData = { id: 1, quoteStatus: quoteStatus };
      mockQuoteService = {
        data: Observable.of({ data: mockData }),
        state: { data: mockData },
        getPaymentOptions: jasmine.createSpy('getPaymentOptions'),
        hasAssetLineItems: quoteHasAssets,
        retrieveLicenseAgreements: jasmine.createSpy('retrieveLicenseAgreements').and.returnValue(Observable.of({})),
        mockRouter: { navigate: jasmine.createSpy('navigate') }
      };

      mockUserCan = {
        viewLicenseAgreementsButton: jasmine.createSpy('viewLicenseAgreementsButton').and.returnValue(canViewLicenses),
        administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(canAdministerQuotes)
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

      return new QuoteTabComponent(mockQuoteService, mockUserCan, mockDialogService, mockRouter, mockUiConfig);
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
  });
}
