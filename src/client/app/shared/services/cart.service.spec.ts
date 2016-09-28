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
      get: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody }))),
      put: () => Observable.of(new Response(new ResponseOptions({ body: mockResponseBody })))
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
          .toHaveBeenCalledWith('/api/orders/v1/cart');
      });

      // TODO: The linter chokes on "calls".
      // error TS2339: Property 'calls' does not exist on type '() => Observable<Response>'.
      it('calls the API service only the first time', () => {
        mockResponseBody = '{ "userId": "10836" }';

        serviceUnderTest.initializeData();
        serviceUnderTest.initializeData();

        expect(mockApiService.get.calls.count()).toEqual(1);
      });

      it('sets up the cart store', () => {
        mockResponseBody = '{ "total": "47" }';

        serviceUnderTest.initializeData();

        expect(serviceUnderTest.state.total).toEqual('47');
      });
    });

    describe('destroyData()', () => {
      it('destroys the cart store', inject([CartService], (serviceUnderTest: CartService) => {
        mockResponseBody = '{ "userId": "10836" }';

        // Initially...
        expect(serviceUnderTest.state.userId).toBeNaN();

        serviceUnderTest.initializeData();
        expect(serviceUnderTest.state.userId).toEqual('10836');

        serviceUnderTest.destroyData();
        expect(serviceUnderTest.state.userId).toBeNaN();
      }));
    });

    describe('addAssetToProjectInCart()', () => {

      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the api service correctly',() => {
        serviceUnderTest.addAssetToProjectInCart({ 'assetId': '10836' });
        expect(mockApiService.put)
          .toHaveBeenCalledWith(
            '/api/orders/v1/cart/asset/lineItem?region=AAA',
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
