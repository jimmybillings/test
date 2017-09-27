import { PricingService } from './pricing.service';
import { Api } from '../interfaces/api.interface';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';

export function main() {
  describe('Pricing Service', () => {
    let serviceUnderTest: PricingService, mockApiService: MockApiService;

    const mockAsset: any = { assetId: 12345 };
    const mockMarkers: any = {
      in: {
        asMilliseconds: () => 1000
      },
      out: {
        asMilliseconds: () => 10000
      }
    };

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new PricingService(mockApiService.injector);
    });

    describe('getPriceFor()', () => {
      describe('calls the apiService correctly', () => {
        it('with markers', () => {
          serviceUnderTest.getPriceFor(mockAsset, { some: 'attribute' }, mockMarkers);

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('priceBook/price/12345');
          expect(mockApiService.get).toHaveBeenCalledWithParameters({
            region: 'AAA',
            attributes: 'some:attribute',
            startSecond: 1000,
            endSecond: 10000
          });
        });

        it('without markers', () => {
          serviceUnderTest.getPriceFor(mockAsset, { some: 'attribute' });

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('priceBook/price/12345');
          expect(mockApiService.get).toHaveBeenCalledWithParameters({
            region: 'AAA',
            attributes: 'some:attribute'
          });
        });
      });


      it('maps the response to a number', () => {
        mockApiService.getResponse = { price: 1000, some: 'other data', that: 'we dont care about' };
        serviceUnderTest.getPriceFor(mockAsset, { some: 'attributes' }, mockMarkers).subscribe(res => {
          expect(res).toBe(1000);
        });
      });
    });

    describe('getPriceAttributes', () => {
      describe('calls the apiService correctly', () => {
        it('with no priceModel', () => {
          serviceUnderTest.getPriceAttributes();

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('priceBook/priceAttributes');
          expect(mockApiService.get).toHaveBeenCalledWithParameters({ region: 'AAA', priceModel: 'RightsManaged' });
        });

        it('with a price model', () => {
          serviceUnderTest.getPriceAttributes('Royalty Free');

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('priceBook/priceAttributes');
          expect(mockApiService.get).toHaveBeenCalledWithParameters({ region: 'AAA', priceModel: 'RoyaltyFree' });

        });
      });

      it('maps the response to an array of price attributes', () => {
        mockApiService.getResponse = { list: [{ some: 'attribute' }, { some: 'otherAttribute' }] };

        serviceUnderTest.getPriceAttributes().subscribe(res => {
          expect(res).toEqual([{ some: 'attribute', primary: true }, { some: 'otherAttribute' }]);
        });
      });
    });
  });
}
