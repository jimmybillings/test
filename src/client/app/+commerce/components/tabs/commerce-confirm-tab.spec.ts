import { CommerceConfirmTab } from './commerce-confirm-tab';

export function main() {
  describe('Confirm Tab Component', () => {
    let componentUnderTest: CommerceConfirmTab, mockCommerceService: any;
    mockCommerceService = { state: { data: { itemCount: 1, projects: [], quoteStauts: 'blah' } } };

    beforeEach(() => {
      componentUnderTest = new CommerceConfirmTab(null, mockCommerceService, null, null);
    });

    describe('hasDiscount()', () => {
      it('should return false when discount does NOT exists', () => {
        expect(componentUnderTest.hasDiscount).toBe(false);
      });

      it('should return true if discount has a value', () => {
        let mockState = { data: { discount: 12.0 } };

        mockCommerceService = {
          state: mockState,
        };
        componentUnderTest = new CommerceConfirmTab(null, mockCommerceService, null, null);
        expect(componentUnderTest.hasDiscount).toBe(true);
      });
    });
  });
};
