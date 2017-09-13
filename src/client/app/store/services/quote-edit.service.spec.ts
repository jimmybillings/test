import { FutureQuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Future Quote Edit Service', () => {
    let serviceUnderTest: FutureQuoteEditService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();

      serviceUnderTest = new FutureQuoteEditService(mockApiService.injector);
    });

    describe('load()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.load();

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/focused');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);
      });

      it('returns an observable', () => {
        mockApiService.getResponse = { some: 'quote' };

        serviceUnderTest.load().subscribe(q => expect(q).toEqual({ some: 'quote' }));
      });
    });

    describe('delete()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.delete(1);

        expect(mockApiService.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.delete).toHaveBeenCalledWithEndpoint('quote/1');
        expect(mockApiService.delete).toHaveBeenCalledWithLoading('onBeforeRequest');
      });

      it('switchMaps to a .load()', () => {
        let response: any;
        serviceUnderTest.delete(1).subscribe(res => response = res);

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/focused');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);

        expect(response).toEqual(mockApiService.getResponse);
      });
    });
  });
}
