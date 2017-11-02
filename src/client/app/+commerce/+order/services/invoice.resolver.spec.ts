import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { InvoiceResolver } from './invoice.resolver';

export function main() {
  describe('Invoice Resolver', () => {
    const mockRoute: any = { params: { id: '9001' } };
    let resolverUnderTest: InvoiceResolver, mockStore: MockAppStore, loadSpy: jasmine.Spy, resolved: jasmine.Spy;

    beforeEach(() => {
      mockStore = new MockAppStore();
      loadSpy = mockStore.createActionFactoryMethod('invoice', 'load');
      resolved = jasmine.createSpy('resolved');
      resolverUnderTest = new InvoiceResolver(mockStore);
    });

    describe('resolve()', () => {
      it('should dispatch the proper action', () => {
        resolverUnderTest.resolve(mockRoute);
        expect(loadSpy).toHaveBeenCalledWith(9001);
      });

      it('Should not resolve if the Invoice store has no data from the server', () => {
        mockStore.createStateSection('invoice', { loading: true });
        resolverUnderTest.resolve(mockRoute).subscribe(resolved);
        expect(resolved).not.toHaveBeenCalled();
      });

      it('Should resolve if the Invoice store already has data from the server', () => {
        mockStore.createStateSection('asset', { loading: false });
        resolverUnderTest.resolve(mockRoute).subscribe(resolved);
        expect(resolved).toHaveBeenCalled();
      });
    });
  });
};
