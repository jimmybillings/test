import { FutureQuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Frame } from '../../shared/modules/wazee-frame-formatter/index';

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

    describe('editLineItem()', () => {
      describe('calls the api service correctly', () => {
        it('when called with markers and attributes', () => {
          serviceUnderTest.editLineItem(
            7,
            { id: 3, asset: { some: 'asset' } } as any,
            { in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) },
            { some: 'attribute' }
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 1000, timeEnd: 2000 },
            attributes: [
              { priceAttributeName: 'some', selectedAttributeValue: 'attribute' }
            ]
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });

        it('when just called with attributes', () => {
          serviceUnderTest.editLineItem(
            7,
            { id: 3, asset: { some: 'asset', timeStart: 333, timeEnd: 999 } } as any,
            null,
            { some: 'attribute' }
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 333, timeEnd: 999 },
            attributes: [
              { priceAttributeName: 'some', selectedAttributeValue: 'attribute' }
            ]
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });

        it('when just called with markers', () => {
          serviceUnderTest.editLineItem(
            7,
            {
              id: 3,
              asset: { some: 'asset' }
            } as any,
            { in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) },
            null
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 1000, timeEnd: 2000 },
            attributes: []
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });
      });

      describe('removeAsset()', () => {
        it('calls the API correctly', () => {
          serviceUnderTest.removeAsset(123, { uuid: 'ABCD' });

          expect(mockApiService.delete).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.delete).toHaveBeenCalledWithEndpoint('quote/123/asset/ABCD');
          expect(mockApiService.delete).toHaveBeenCalledWithLoading(true);
        });
      });

      describe('addCustomPriceToLineItem', () => {
        it('calls the apiService correctly', () => {
          serviceUnderTest.addCustomPriceToLineItem(10, { id: 'abc-123', itemPrice: 100 } as any, 1000);

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/10/update/lineItem/abc-123');
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 'abc-123',
            itemPrice: 100,
            multiplier: 10
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
        });
      });

      describe('sendQuote', () => {
        it('should call the api service correctly', () => {
          serviceUnderTest.sendQuote(3, {
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'ProvisionalOrder'
          }).take(1).subscribe();
          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/send/3');
          expect(mockApiService.put).toHaveBeenCalledWithParameters({
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'ProvisionalOrder'
          });
        });

        it('should omit the purchaseType parameter if the purchase type is Standard', () => {
          serviceUnderTest.sendQuote(3, {
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'Standard'
          }).take(1).subscribe();
          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/send/3');
          expect(mockApiService.put).toHaveBeenCalledWithParameters({
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z'
          });
        });
      });
    });
  });
}
