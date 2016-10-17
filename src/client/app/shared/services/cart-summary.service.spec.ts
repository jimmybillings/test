import { inject, TestBed, beforeEachProvidersArray } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Api, ApiBody, ApiParameters } from '../interfaces/api.interface';
import { CartSummaryService } from './cart-summary.service';

export function main() {
  describe('Cart Summary Service', () => {
    let mockResponseBody: Object;

    const mockApi = {
      get2: () => Observable.of(mockResponseBody),
      put2: () => Observable.of(mockResponseBody)
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartSummaryService,
          { provide: ApiService, useValue: mockApi }
        ]
      });

      mockResponseBody = '{}';
      spyOn(mockApi, 'get2').and.callThrough();
      spyOn(mockApi, 'put2').and.callThrough();
    });

    describe('addAssetToProjectInCart()', () => {
      let serviceUnderTest: CartSummaryService;

      beforeEach(inject([CartSummaryService], (cartSummary: CartSummaryService) => {
        serviceUnderTest = cartSummary;
      }));

      it('calls the api service correctly', () => {
        const body: ApiBody = { lineItem: { asset: { assetId: '10836' } } };
        const parameters: ApiParameters = { projectName: 'Project A', region: 'AAA' };

        serviceUnderTest.addAssetToProjectInCart({ assetId: '10836' });

        expect(mockApi.put2)
          .toHaveBeenCalledWith(Api.Orders, 'cart/asset/lineItem/quick', { body: body, parameters: parameters });
      });

      it('adds the asset to the cart store', () => {
        mockResponseBody = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.addAssetToProjectInCart({ assetId: '10836' });

        expect(serviceUnderTest.state.lineItem.asset.assetId).toEqual('10836');
      });

    });

    describe('loadCartSummary', () => {
      let serviceUnderTest: CartSummaryService;

      beforeEach(inject([CartSummaryService], (cartSummary: CartSummaryService) => {
        serviceUnderTest = cartSummary;
      }));

      it('calls the api service correctly', () => {
        serviceUnderTest.loadCartSummary();

        expect(mockApi.get2).toHaveBeenCalledWith(Api.Orders, 'cart/summary');
      });

      it('places the response in the cart store', () => {
        mockResponseBody = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.loadCartSummary();

        expect(serviceUnderTest.state.lineItem.asset.assetId).toEqual('10836');
      });
    });
  });
}