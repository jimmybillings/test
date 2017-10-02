import { LineItemPriceComponent } from './line-item-price.component';

export function main() {
  describe('Line Item Price Component', () => {
    let componentUnderTest: LineItemPriceComponent;

    beforeEach(() => {
      componentUnderTest = new LineItemPriceComponent();
    });

    describe('needsAttributes getter', () => {
      describe('returns true ', () => {
        it('when the lineItem is \'Rights Managed\' and doesn\'t have price attributes', () => {
          componentUnderTest.rightsManaged = 'Rights Managed';
          componentUnderTest.hasAttributes = false;

          expect(componentUnderTest.needsAttributes).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the lineItem is not \'Rights Managed\'', () => {
          componentUnderTest.rightsManaged = 'Royalty Free';

          expect(componentUnderTest.needsAttributes).toBe(false);
        });

        it('when the lineItem is \'Rights Managed\', but it does have attributes', () => {
          componentUnderTest.rightsManaged = 'Rights Managed';
          componentUnderTest.hasAttributes = true;

          expect(componentUnderTest.needsAttributes).toBe(false);
        });
      });
    });

    describe('shouldShowMultiplier getter', () => {
      describe('returns true', () => {
        it('when the user can administer quotes and the multiplier is greater than 1', () => {
          componentUnderTest.userCanAdministerQuotes = true;
          componentUnderTest.multiplier = 2;

          expect(componentUnderTest.shouldShowMultiplier).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user cannot administer quotes', () => {
          componentUnderTest.userCanAdministerQuotes = false;

          expect(componentUnderTest.shouldShowMultiplier).toBe(false);
        });

        it('when the user can administer quotes, but the multiplier is less than 1', () => {
          componentUnderTest.userCanAdministerQuotes = true;
          componentUnderTest.multiplier = 0;

          expect(componentUnderTest.shouldShowMultiplier).toBe(false);
        });
      });
    });

    describe('formattedMultiplier getter', () => {
      describe('returns the multiplier truncated (NOT ROUNDED) at 2 decimal places', () => {
        it('for a small number', () => {
          componentUnderTest.multiplier = 8.8796543;

          expect(componentUnderTest.formattedMultiplier).toEqual('8.87');
        });

        it('for a large number', () => {
          componentUnderTest.multiplier = 1758.19241;

          expect(componentUnderTest.formattedMultiplier).toEqual('1758.19');
        });

        it('for a number with only 1 decimal point', () => {
          componentUnderTest.multiplier = 4.1;

          expect(componentUnderTest.formattedMultiplier).toEqual('4.1');
        });

        it('for a number with no decimal points', () => {
          componentUnderTest.multiplier = 4;

          expect(componentUnderTest.formattedMultiplier).toEqual('4');
        });
      });
    });

    describe('showAdminPrice getter', () => {
      describe('returns true', () => {
        it('when the user can administer quotes, and the lineItem doesnt need attributes', () => {
          componentUnderTest.userCanAdministerQuotes = true;
          componentUnderTest.rightsManaged = 'Royalty Free';

          expect(componentUnderTest.showAdminPrice).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the user can\'t administer quotes', () => {
          componentUnderTest.userCanAdministerQuotes = false;

          expect(componentUnderTest.showAdminPrice).toBe(false);
        });
        it('when the user can administer quotes, but the lineItem does need attributes', () => {
          componentUnderTest.userCanAdministerQuotes = true;
          componentUnderTest.rightsManaged = 'Rights Managed';
          componentUnderTest.hasAttributes = false;

          expect(componentUnderTest.showAdminPrice).toBe(false);
        });
      });
    });

    describe('onClickPrice()', () => {
      it('emits the addCustomPrice event', () => {
        spyOn(componentUnderTest.addCustomPrice, 'emit');
        componentUnderTest.onClickPrice();
        expect(componentUnderTest.addCustomPrice.emit).toHaveBeenCalled();
      });
    });
  });
}
