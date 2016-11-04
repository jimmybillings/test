import { RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { OrderResolver } from './order.resolver';

export function main() {
  describe('Order Resolver', () => {
    // let mockUiConfig: any;
    const mockObservable = Observable.of({});
    const mockOrdersService: any = {
      getOrder: jasmine.createSpy('getOrder').and.returnValue(mockObservable)
    };

    const mockRoute: any = {
      params: Observable.of({ d: true, i: 0, n: 1, s: 'createdOn' }),
      snapshot: { url: [{}] }
    };

    const mockState: RouterStateSnapshot = undefined;

    let resolverUnderTest: OrderResolver;

    beforeEach(() => {
      resolverUnderTest = new OrderResolver(mockOrdersService);
    });

    describe('resolve()', () => {
      let returnedObservable: Observable<any>;

      beforeEach(() => {
        returnedObservable = resolverUnderTest.resolve(mockRoute, mockState);
      });

      it('tells the order service to get order data', () => {
        expect(mockOrdersService.getOrder).toHaveBeenCalled();
      });

      it('returns the Observable returned by getOrder()', () => {
        expect(returnedObservable).toBe(mockObservable);
      });
    });
  });
};
