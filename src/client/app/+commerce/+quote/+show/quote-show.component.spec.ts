import { QuoteShowComponent } from './quote-show.component';
import { Observable } from 'rxjs/Observable';


export function main() {
  describe('Quote Show Component', () => {
    let componentUnderTest: QuoteShowComponent, mockCapabilities: any, mockQuoteService: any;

    mockCapabilities = { administerQuotes: () => false };
    mockQuoteService = { data: Observable.of({}), state: { data: { purchaseType: 'blah' } } };

    beforeEach(() => {
      componentUnderTest = new QuoteShowComponent(mockCapabilities, mockQuoteService);
    });

    describe('Initialization', () => {
      it('defines the expected tabs', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.tabLabelKeys).toEqual(['quote', 'billing', 'payment', 'confirm']);
      });

      it('disables all but the first tab', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.tabEnabled).toEqual([true, false, false, false]);
      });

      it('selects the first tab', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.selectedTabIndex).toBe(0);
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
  });
}
