import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CartResolver } from './cart.resolver';

export function main() {
  describe('Cart Resolver', () => {
    const mockObservable = Observable.of({});
    const mockCartService: any = {
      initializeData: jasmine.createSpy('initializeData() spy').and.returnValue(mockObservable)
    };
    const mockRoute: ActivatedRouteSnapshot = undefined;
    const mockState: RouterStateSnapshot = undefined;
    let resolverUnderTest: CartResolver;

    beforeEach(() => {
      resolverUnderTest = new CartResolver(mockCartService);
    });

    describe('resolve()', () => {
      let returnedObservable: Observable<any>;

      beforeEach(() => {
        returnedObservable = resolverUnderTest.resolve(mockRoute, mockState);
      });

      it('tells the cart service to load data', () => {
        expect(mockCartService.initializeData).toHaveBeenCalled();
      });

      it('returns the Observable returned by initializeData()', () => {
        expect(returnedObservable).toBe(mockObservable);
      });
    });
  });
};
