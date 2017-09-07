import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CartResolver } from './cart.resolver';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Cart Resolver', () => {
    const mockObservable = Observable.of({ userId: 123 });
    let resolverUnderTest: CartResolver, mockStore: MockAppStore, loadSpy: jasmine.Spy;

    beforeEach(() => {
      mockStore = new MockAppStore();
      loadSpy = mockStore.createActionFactoryMethod('cart', 'load');
      resolverUnderTest = new CartResolver(mockStore);
    });

    describe('resolve()', () => {
      it('should dispatch the proper action', () => {
        resolverUnderTest.resolve();

        expect(loadSpy).toHaveBeenCalled();
      });

      it('Should not resolve if the Cart store has no data from the server', () => {
        mockStore.createStateSection('cart', { loading: true });

        expect(() => {
          resolverUnderTest.resolve().take(1).subscribe((data) => {
            throw new Error();
          });
        }).not.toThrow();
      });

      it('Should resolve if the Cart store already has data from the server', () => {
        mockStore.createStateSection('cart', { loading: false });

        resolverUnderTest.resolve().take(1).subscribe((data) => {
          expect(data).toEqual(true);
        });
      });
    });
  });
};
