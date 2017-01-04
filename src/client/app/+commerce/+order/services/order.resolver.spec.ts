import { OrderResolver } from './order.resolver';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Order Resolver', () => {
    let resolverUnderTest: OrderResolver;
    let mockRoute: any;
    const mockOrderService: any = { getOrder: jasmine.createSpy('getOrder') };
    const mockOrderStore: any = { data: Observable.of({ id: 1234 }), state: { id: 1234 } };
    const mockState: any = null;

    beforeEach(() => {
      resolverUnderTest = new OrderResolver(mockOrderService, mockOrderStore);
    });

    describe('Resolve()', () => {
      it('should hit the store if the order is already there', () => {
        mockRoute = { params: { orderId: '1234' } };
        let result: Observable<any> = resolverUnderTest.resolve(mockRoute, mockState);

        result.subscribe((data: any) => {
          expect(data).toEqual(true);
        });
      });

      it('should hit the service if the order is not already there', () => {
        mockRoute = { params: { orderId: '12345' } };
        resolverUnderTest.resolve(mockRoute, mockState);

        expect(mockOrderService.getOrder).toHaveBeenCalledWith('12345');
      });
    });
  });
};
