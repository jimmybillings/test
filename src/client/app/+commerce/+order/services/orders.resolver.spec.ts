import { RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OrdersResolver } from './orders.resolver';

export function main() {
  describe('Orders Resolver', () => {
    // let mockUiConfig: any;
    const mockOrdersService: any = {
      getOrders: jasmine.createSpy('getOrders({d:true,n:20}) spy').and.returnValue(Observable.of({}))
    };

    const mockRoute: any = {
      params: Observable.of({ d: true, i: 0, n: 1, s: 'createdOn' }),
      snapshot: { url: [{}] }
    };

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
        expect(returnedObservable).toEqual(Observable.of({}));
      });
    });
  });
};
