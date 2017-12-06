import { InvoiceComponent } from './invoice.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';
import { Pojo } from '../../../shared/interfaces/common.interface';

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
    const mockObj: Pojo = { a: { b: { c: { d: 'e', f: '', g: 0, h: {} } } } };

    describe('hasProp()', () => {
      it('returns true when the object has the property', () => {
        expect(componentUnderTest.hasProp(mockObj, 'a', 'b', 'c', 'd')).toBe(true);
      });
      it('returns false when the object does not have the property', () => {
        expect(componentUnderTest.hasProp(mockObj, 'a', 'd')).toBe(false);
      });
      it('returns false when the object property is an empty string', () => {
        expect(componentUnderTest.hasProp(mockObj, 'a', 'b', 'c', 'f')).toBe(false);
      });
      it('returns false when the object property is the number 0', () => {
        expect(componentUnderTest.hasProp(mockObj, 'a', 'b', 'c', 'g')).toBe(false);
      });
      it('returns false when the object property is an empty object', () => {
        expect(componentUnderTest.hasProp(mockObj, 'a', 'b', 'c', 'h')).toBe(false);
      });
      it('handles undefined objects', () => {
        expect(componentUnderTest.hasProp(undefined, 'a', 'd')).toBe(false);
      });
      it('handles no props', () => {
        expect(componentUnderTest.hasProp(mockObj)).toBe(true);
      });
    });
  });
}
