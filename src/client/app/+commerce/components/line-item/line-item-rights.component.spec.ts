import { LineItemRightsComponent } from './line-item-rights.component';

export function main() {
  describe('Line Item Rights Component', () => {
    let componentUnderTest: LineItemRightsComponent;

    beforeEach(() => {
      componentUnderTest = new LineItemRightsComponent();
    });

    describe('attributeName', () => {
      it('returns priceAttributeDisplayName over priceAttributeName', () => {
        expect(componentUnderTest.attributeName({
          priceAttributeDisplayName: 'A',
          priceAttributeName: 'a'
        } as any)).toEqual('A');
        expect(componentUnderTest.attributeName({ priceAttributeName: 'a' } as any)).toEqual('a');
      });
    });

    describe('attributeValue', () => {
      it('returns priceAttributeDisplayName over priceAttributeName', () => {
        expect(componentUnderTest.attributeValue({
          selectedAttributeValue: 'a',
          selectedAttributeName: 'A'
        } as any)).toEqual('A');
        expect(componentUnderTest.attributeValue({ selectedAttributeValue: 'a' } as any)).toEqual('a');
      });
    });
  });
}
