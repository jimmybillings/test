import { InvoiceComponent } from './invoice.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';

export function main() {

  describe('Invoice Component', () => {
    let componentUnderTest: InvoiceComponent;
    let mockStore: MockAppStore;
    let mockActivatedRoute: any;

    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('invoice', { invoice: { some: 'invoice' } });
      mockActivatedRoute = { params: Observable.of({ share_key: 'abc-123' }) };
      componentUnderTest = new InvoiceComponent(mockStore, mockActivatedRoute);
    });

    describe('constructor()', () => {
      it('sets up the invoice Observable', () => {
        let invoice: any;
        componentUnderTest.invoice.take(1).subscribe(i => invoice = i);
        expect(invoice).toEqual({ some: 'invoice' });
      });

      it('sets up the isShared Observable', () => {
        let isShared: boolean;
        componentUnderTest.isShared.take(1).subscribe(is => isShared = is);
        expect(isShared).toBe(true);
      });
    });
  });
}
