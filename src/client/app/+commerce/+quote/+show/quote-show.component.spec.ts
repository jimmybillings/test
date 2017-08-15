import { QuoteShowComponent } from './quote-show.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';


export function main() {
  describe('Quote Show Component', () => {
    let componentUnderTest: QuoteShowComponent, mockCapabilities: any, mockQuoteService: any, mockUiConfig: any,
      mockCurrentUserService: any, mockAppStore: MockAppStore;

    beforeEach(() => {
      mockCapabilities = { administerQuotes: () => false };

      mockQuoteService = { data: Observable.of({}), state: { data: { purchaseType: 'blah', id: 7 } } };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: ['wow'] } } }))
      };

      mockCurrentUserService = { data: Observable.of({ id: 10 }) };

      mockAppStore = new MockAppStore();

      componentUnderTest = new QuoteShowComponent(
        mockCapabilities, mockQuoteService, mockUiConfig, mockCurrentUserService, mockAppStore
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
        expect(mockUiConfig.get).toHaveBeenCalledWith('orderableComment');
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
        componentUnderTest = new QuoteShowComponent(null, mockQuoteService, null, null, null);
        expect(componentUnderTest.hasDiscount).toBe(true);
      });
    });

    describe('currentUserId', () => {
      it('should access the data property on the currentUserService', () => {
        componentUnderTest.currentUserId.take(1).subscribe(id => expect(id).toBe(10));
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
  });
}
