import { Observable } from 'rxjs/Rx';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { OrderService } from './order.service';

export function main() {
  describe('Order Service', () => {
    let serviceUnderTest: OrderService;
    let mockOrderStore: any;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockOrderStore = {
        data: Observable.of({ some: 'data' }),
        state: { some: 'state' },
        update: jasmine.createSpy('update')
      };

      mockApi = new MockApiService();
      serviceUnderTest = new OrderService(mockApi.injector, mockOrderStore);
    });

    describe('data getter', () => {
      it('returns the data from the orders store', () => {
        serviceUnderTest.data.subscribe(data => {
          expect(data).toEqual({ some: 'data' });
        });
      });
    });

    describe('getOrder()', () => {

      it('calls the API service correctly', () => {
        serviceUnderTest.getOrder(1).subscribe((res) => {
          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('order/1');
          expect(mockOrderStore.update).toHaveBeenCalledWith(res);
        });
      });
    });

  });
}
