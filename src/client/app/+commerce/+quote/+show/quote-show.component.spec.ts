import { QuoteShowComponent } from './quote-show.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';


export function main() {
  describe('Quote Show Component', () => {
    let componentUnderTest: QuoteShowComponent, mockCapabilities: any, mockQuoteService: any, mockUiConfig: any,
      mockAppStore: MockAppStore;

    beforeEach(() => {
      mockCapabilities = { administerQuotes: () => false };

      mockQuoteService = { data: Observable.of({}), state: { data: { purchaseType: 'blah', id: 7 } } };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: ['wow'] } } }))
      };

      mockAppStore = new MockAppStore();

      componentUnderTest = new QuoteShowComponent(
        mockCapabilities, mockQuoteService, mockUiConfig, mockAppStore
      );
    });

    describe('Initialization', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('defines the expected tabs', () => {
        expect(componentUnderTest.tabLabelKeys).toEqual(['quote', 'billing', 'payment', 'confirm']);
      });

      it('disables all but the first tab', () => {
        expect(componentUnderTest.tabEnabled).toEqual([true, false, false, false]);
      });

      it('selects the first tab', () => {
        expect(componentUnderTest.selectedTabIndex).toBe(0);
      });

      it('access the right part of the uiConfig store', () => {
        expect(mockUiConfig.get).toHaveBeenCalledWith('quoteComment');
      });

      it('assigns the commentFormConfig instance variable', () => {
        expect(componentUnderTest.commentFormConfig).toEqual(['wow']);
      });

      it('assigns the commentParentObject instance variable', () => {
        expect(componentUnderTest.commentParentObject).toEqual({ objectType: 'quote', objectId: 7 });
      });
    });

    describe('onNotification()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      describe('GO_TO_NEXT_TAB', () => {
        it('enables the next tab, but no others', () => {
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          expect(componentUnderTest.tabEnabled).toEqual([true, true, false, false]);
        });

        it('selects the next tab', (done) => {
          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          setTimeout(_ => {
            expect(componentUnderTest.selectedTabIndex).toBe(1);
            done();
          }, 100);
        });

        it('does not advance beyond the last tab', (done) => {
          componentUnderTest.selectedTabIndex = 4;

          componentUnderTest.onNotification({ type: 'GO_TO_NEXT_TAB' });

          setTimeout(_ => {
            expect(componentUnderTest.selectedTabIndex).toBe(4);
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
    });

    describe('hasDiscount()', () => {
      it('should return false when discount does NOT exists', () => {
        expect(componentUnderTest.hasDiscount).toBe(false);
      });

      it('should return true if discount has a value', () => {
        let mockState = { data: { discount: 12.0 } };

        mockQuoteService = {
          data: Observable.of({ data: {} }),
          state: mockState,
        };
        componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
        expect(componentUnderTest.hasDiscount).toBe(true);
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

    describe('commentCount', () => {
      it('should get the count from the correct part of the store', () => {
        mockAppStore.createStateSection('comment', { quote: { pagination: { totalCount: 10 } } });

        componentUnderTest.commentCount.take(1).subscribe(count => expect(count).toBe(10));
      });
    });

    describe('offlineAgreementIds getter', () => {
      describe('should return any externalAgreementIds from the quote\'s lineItems', () => {
        it('for 1 lineItem in 1 project', () => {
          mockQuoteService = {
            data: Observable.of({ data: { projects: [{ lineItems: [{ externalAgreementIds: ['abc-123'] }] }] } })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('abc-123');
        });

        it('for 1 lineItem in many projects', () => {
          mockQuoteService = {
            data: Observable.of({
              data: {
                projects: [
                  { lineItems: [{ externalAgreementIds: ['abc-123'] }] },
                  { lineItems: [{ externalAgreementIds: ['def-456'] }] }
                ]
              }
            })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('abc-123, def-456');
        });

        it('for many lineItems in 1 project', () => {
          mockQuoteService = {
            data: Observable.of({
              data: { projects: [{ lineItems: [{ externalAgreementIds: ['abc-123'] }, { externalAgreementIds: ['def-456'] }] }] }
            })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('abc-123, def-456');
        });

        it('for many lineItems in many projects', () => {
          mockQuoteService = {
            data: Observable.of({
              data: {
                projects: [
                  { lineItems: [{ externalAgreementIds: ['abc-123'] }, { externalAgreementIds: ['def-456'] }] },
                  { lineItems: [{ externalAgreementIds: ['fgh-789'] }, { externalAgreementIds: ['ijk-012'] }] }
                ]
              }
            })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('abc-123, def-456, fgh-789, ijk-012');
        });

        it('with duplicate identifiers', () => {
          mockQuoteService = {
            data: Observable.of({
              data: { projects: [{ lineItems: [{ externalAgreementIds: ['abc-123'] }, { externalAgreementIds: ['abc-123'] }] }] }
            })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('abc-123');
        });

        it('with no identifiers', () => {
          mockQuoteService = {
            data: Observable.of({
              data: { projects: [{ lineItems: [{ some: 'lineItem' }, { some: 'lineItem' }] }] }
            })
          };
          componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null);
          let actualIds: string;
          componentUnderTest.offlineAgreementIds.take(1).subscribe(ids => actualIds = ids);

          expect(actualIds).toEqual('');
        });
      });
    });
  });
}
