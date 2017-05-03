import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CartResolver } from './cart.resolver';

export function main() {
  describe('Cart Resolver', () => {
    const mockObservable = Observable.of({ userId: 123 });
    const mockRoute: ActivatedRouteSnapshot = undefined;
    const mockState: RouterStateSnapshot = undefined;
    let resolverUnderTest: CartResolver;
    let mockCartService: any = {
      loaded: false,
      data: Observable.of(mockObservable)
    };

    beforeEach(() => {
      resolverUnderTest = new CartResolver(mockCartService);
    });

    describe('resolve()', () => {
      it('Should not resolve if the Cart store has no data from the server', () => {
        expect(() => {
          resolverUnderTest.resolve(mockRoute, mockState).take(1).subscribe((data) => {
            throw new Error();
          });
        }).not.toThrow();
      });

      it('Should resolve if the Cart store already has data from the server', () => {
        mockCartService.loaded = true;
        resolverUnderTest.resolve(mockRoute, mockState).take(1).subscribe((data) => {
          expect(data).toEqual(mockObservable);
        });
      });
    });
  });
};
