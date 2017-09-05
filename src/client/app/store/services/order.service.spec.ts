import { Observable } from 'rxjs/Observable';

import { FutureOrderService } from './order.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Order Service', () => {
    let serviceUnderTest: FutureOrderService;
    let mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      mockApiService.getResponse = { some: 'order' };

      serviceUnderTest = new FutureOrderService(mockApiService.injector);
    });

    describe('load()', () => {
      it('calls the API correctly', () => {
        serviceUnderTest.load(47);

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('order/47');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);
      });

      it('returns an observable of an order', () => {
        mockApiService.getResponse = { some: 'order' };

        expect(serviceUnderTest.load(47)).toEqual(Observable.of({ some: 'order' }));
      });
    });
  });
}
