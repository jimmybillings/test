import { InvoiceComponent } from './invoice.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Invoice Component', () => {
    let componentUnderTest: InvoiceComponent;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();
      componentUnderTest = new InvoiceComponent(mockStore);
    });

    it('has no testable functionality', () => {
      expect(true).toBe(true);
    });
  });
}
