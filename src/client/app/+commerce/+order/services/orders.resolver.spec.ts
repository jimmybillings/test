import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { OrdersResolver } from './orders.resolver';

export function main() {
  describe('Orders Resolver', () => {
    const mockObservable = Observable.of({});
    const mockOrdersService: any = {
      getOrders: jasmine.createSpy('getOrders() spy').and.returnValue(mockObservable)
    };
    const mockRoute: ActivatedRouteSnapshot = undefined;
    const mockState: RouterStateSnapshot = undefined;

    let resolverUnderTest: OrdersResolver;

    beforeEach(() => {
      resolverUnderTest = new OrdersResolver(mockOrdersService);
    });

    describe('resolve()', () => {
      let returnedObservable: Observable<any>;

      beforeEach(() => {
        returnedObservable = resolverUnderTest.resolve(mockRoute, mockState);
      });

      it('tells the orders service to get orders data', () => {
        expect(mockOrdersService.getOrders).toHaveBeenCalled();
      });

      it('returns the Observable returned by getOrders()', () => {
        expect(returnedObservable).toBe(mockObservable);
      });
    });
  });
};
