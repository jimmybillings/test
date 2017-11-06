import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { CommerceConfirmTab } from './commerce-confirm-tab';

export function main() {
  describe('Confirm Tab Component', () => {
    let componentUnderTest: CommerceConfirmTab;
    let mockCommerceService: any;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockCommerceService = { state: { data: { itemCount: 1, projects: [], quoteStauts: 'blah' } } };
      mockStore = new MockAppStore();
      componentUnderTest = new CommerceConfirmTab(null, mockCommerceService, null, null, mockStore);
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
        componentUnderTest = new CommerceConfirmTab(null, mockCommerceService, null, null, mockStore);
        expect(componentUnderTest.hasDiscount).toBe(true);
      });
    });
  });
};
