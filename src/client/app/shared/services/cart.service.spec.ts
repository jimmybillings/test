import { inject, TestBed, beforeEachProvidersArray, Response, ResponseOptions } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiConfig } from './api.config';
import { ApiService } from './api.service';
import { CartService } from './cart.service';

export function main() {
  describe('Cart Service', () => {
    const mockApiConfig = {
      baseUrl: () => 'SOME_BASE_URL/',
      authHeaders: () => 'SOME_AUTH_HEADERS'
    };

    let mockResponseBody: string;

    const mockApiService = {
      get: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody })))
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartService,
          { provide: ApiConfig, useValue: mockApiConfig },
          { provide: ApiService, useValue: mockApiService }
        ]
      });

      mockResponseBody = '{}';
      spyOn(mockApiService, 'get').and.callThrough();
    });

    describe('loadCart', () => {
      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the API correctly', () => {
        serviceUnderTest.loadCart();

        expect(mockApiService.get)
          .toHaveBeenCalledWith('SOME_BASE_URL/api/orders/v1/cart', { headers: 'SOME_AUTH_HEADERS', body: '' });
      });

      it('sets up the cart store', () => {
        mockResponseBody = '{ "total": "47" }';
        serviceUnderTest.loadCart();

        serviceUnderTest.data.subscribe((cartData) => {
          expect(cartData.total).toEqual('47');
        });
      });
    });
  });
}
