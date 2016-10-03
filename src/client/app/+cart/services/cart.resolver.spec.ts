import { inject, TestBed, beforeEachProvidersArray } from '../../imports/test.imports';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

export function main() {
  describe('Cart Resolver', () => {
    const mockObservable = Observable.of({});
    const mockCartService = {
      initializeData: jasmine.createSpy('initializeData() spy').and.returnValue(mockObservable)
    };
    const mockRoute: ActivatedRouteSnapshot = undefined;
    const mockState: RouterStateSnapshot = undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartResolver,
          { provide: CartService, useValue: mockCartService }
        ]
      });
    });

    describe('resolve()', () => {
      let returnedObservable: Observable<any>;

      beforeEach(inject([CartResolver], (cartResolver: CartResolver) => {
        returnedObservable = cartResolver.resolve(mockRoute, mockState);
      }));

      it('tells the cart service to load data', () => {
        expect(mockCartService.initializeData).toHaveBeenCalled();
      });

      it('returns the Observable returned by initializeData()', () => {
        expect(returnedObservable).toBe(mockObservable);
      });
    });
  });
};
