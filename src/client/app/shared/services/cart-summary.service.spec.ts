import { inject, TestBed, beforeEachProvidersArray, Response, ResponseOptions } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiConfig } from './api.config';
import { ApiService } from './api.service';
import { CartSummaryService } from './cart-summary.service';

export function main() {
  describe('Cart Summary Service', () => {
    const mockApiConfig = {
      baseUrl: () => 'SOME_BASE_URL/',
      authHeaders: () => 'SOME_AUTH_HEADERS'
    };

    let mockResponseBody: string;

    const mockApiService = {
      get: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody }))),
      put: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody })))
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartSummaryService,
          { provide: ApiConfig, useValue: mockApiConfig },
          { provide: ApiService, useValue: mockApiService }
        ]
      });

      mockResponseBody = '{}';
      spyOn(mockApiService, 'get').and.callThrough();
      spyOn(mockApiService, 'put').and.callThrough();
    });

    describe('addAssetToProjectInCart()', () => {

      let serviceUnderTest: CartSummaryService;

      beforeEach(inject([CartSummaryService], (cartSummary: CartSummaryService) => {
        serviceUnderTest = cartSummary;
      }));

      it('calls the api service correctly',() => {
        serviceUnderTest.addAssetToProjectInCart({ 'assetId': '10836' });
        expect(mockApiService.put)
          .toHaveBeenCalledWith(
            '/api/orders/v1/cart/asset/lineItem',
            JSON.stringify({'lineItem': {'asset': {'assetId': '10836' }}}));
      });

      it('adds the asset to the cart store', () => {
        mockResponseBody = JSON.stringify({'lineItem': {'asset': {'assetId': '10836' }}});
        serviceUnderTest.addAssetToProjectInCart({ 'assetId': '10836' });
        expect(serviceUnderTest.state.lineItem.asset.assetId).toEqual('10836');
      });

    });
  });
}