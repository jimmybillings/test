import { LineItemPriceComponent } from './line-item-price.component';

export function main() {
  xdescribe('Line Item Price Component', () => {
    let componentUnderTest: LineItemPriceComponent;

    beforeEach(() => {
      componentUnderTest = new LineItemPriceComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
