import { inject, TestBed, beforeEachProvidersArray } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Api, ApiBody, ApiParameters } from '../interfaces/api.interface';
import { CartSummaryService } from './cart-summary.service';

export function main() {
  describe('Cart Summary Service', () => {
    let mockResponseBody: Object;

    const mockApi = {
      get: () => Observable.of(mockResponseBody),
      put: () => Observable.of(mockResponseBody)
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
      spyOn(mockApi, 'get').and.callThrough();
      spyOn(mockApi, 'put').and.callThrough();
    });

    describe('addAssetToProjectInCart()', () => {
      let serviceUnderTest: CartSummaryService;

      beforeEach(inject([CartSummaryService], (cartSummary: CartSummaryService) => {
        serviceUnderTest = cartSummary;
      }));

      it('calls the api service correctly', () => {
        const body: ApiBody = { lineItem: { asset: { assetId: '10836' }, selectedTranscodeTarget: '1080p' } };
        const parameters: ApiParameters = { projectName: 'Project A', region: 'AAA' };

        serviceUnderTest.addAssetToProjectInCart('10836', '1080p');

        expect(mockApi.put)
          .toHaveBeenCalledWith(Api.Orders, 'cart/asset/lineItem/quick', { body: body, parameters: parameters });
      });

      it('calls the api service correctly - no transcode target', () => {
        const body: ApiBody = { lineItem: { asset: { assetId: '10836' }, selectedTranscodeTarget: 'master_copy' } };
        const parameters: ApiParameters = { projectName: 'Project A', region: 'AAA' };

        serviceUnderTest.addAssetToProjectInCart('10836');

        expect(mockApi.put)
          .toHaveBeenCalledWith(Api.Orders, 'cart/asset/lineItem/quick', { body: body, parameters: parameters });
      });

      it('adds the asset to the cart store', () => {
        mockResponseBody = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.addAssetToProjectInCart('10836');

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

        expect(mockApi.get).toHaveBeenCalledWith(Api.Orders, 'cart/summary');
      });

      it('places the response in the cart store', () => {
        mockResponseBody = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.loadCartSummary();

        expect(serviceUnderTest.state.lineItem.asset.assetId).toEqual('10836');
      });
    });
  });
}
