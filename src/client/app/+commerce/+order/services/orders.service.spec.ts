import { Observable } from 'rxjs/Rx';

import { MockApiService, mockApiMatchers } from '../../../shared/mocks/mock-api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { OrdersService } from './orders.service';

export function main() {
  describe('Orders Service', () => {
    let serviceUnderTest: OrdersService;
    let mockOrdersStore: any;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockOrdersStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        data: Observable.of({ some: 'data' }),
        state: { some: 'state' }
      };

      mockApi = new MockApiService();

      serviceUnderTest = new OrdersService(mockApi.injector, mockOrdersStore);
    });

    describe('data getter', () => {
      it('returns the data from the orders store', () => {
        serviceUnderTest.data.subscribe(data => {
          expect(data).toEqual({ some: 'data' });
        });
      });
    });

    describe('getOrders()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.getOrders();
        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('order/myOrders');
        expect(mockApi.get).toHaveBeenCalledWithLoading(true);
      });
    });

  });
}
