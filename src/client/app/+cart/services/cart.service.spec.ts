import { inject, TestBed, beforeEachProvidersArray, Response, ResponseOptions } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../shared/services/api.service';
import { CartService } from './cart.service';
import { CartStore } from './cart.store';

export function main() {
  describe('Cart Service', () => {
    let mockResponseBody: string;

    const mockApiService = {
      get: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody }))),
      put: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody })))
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartService,
          CartStore,
          { provide: ApiService, useValue: mockApiService }
        ]
      });

      mockResponseBody = '{}';
      spyOn(mockApiService, 'get').and.callThrough();
      spyOn(mockApiService, 'put').and.callThrough();
    });

    describe('initializeData()', () => {
      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the API service correctly', () => {
        serviceUnderTest.initializeData();

        expect(mockApiService.get)
          .toHaveBeenCalledWith('/api/orders/v1/cart', {}, true);
      });

      it('sets up the cart store', () => {
        mockResponseBody = '{ "total": "47" }';

        serviceUnderTest.initializeData().subscribe(() => {
          expect(serviceUnderTest.state.total).toEqual('47');
        });
      });
    });
  });
}
