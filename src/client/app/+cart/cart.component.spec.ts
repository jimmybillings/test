import { CartComponent } from './cart.component';

export function main() {
  describe('Cart Component', () => {
    let componentUnderTest: CartComponent;

    beforeEach(() => {
      componentUnderTest = new CartComponent();
    });

    describe('Initialization', () => {
      it('defines the expected tabs', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.tabLabelKeys).toEqual(['cart', 'review', 'billing', 'payment', 'confirm']);
      });

      it('disables all but the first tab', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.tabEnabled).toEqual([true, false, false, false, false]);
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

          expect(componentUnderTest.tabEnabled).toEqual([true, true, false, false, false]);
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
    });
  });
};
