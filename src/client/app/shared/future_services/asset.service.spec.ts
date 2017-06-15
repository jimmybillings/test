import { FutureAssetService } from './asset.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';

export function main() {
  describe('Future Asset Service', () => {
    let serviceUnderTest: FutureAssetService;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      mockApi.getResponse = { some: 'asset' };
      serviceUnderTest = new FutureAssetService(mockApi.injector);
    });

    describe('load()', () => {
      it('calls the API correctly with just an asset ID', () => {
        serviceUnderTest.load({ id: '47' });

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('clip/47/clipDetail');
        expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        expect(mockApi.get).not.toHaveBeenCalledWithOverridingToken(jasmine.any(String));
      });

      it('calls the API correctly with a share key', () => {
        serviceUnderTest.load({ id: '47', share_key: 'some_key' });

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('clip/47/clipDetail');
        expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        expect(mockApi.get).toHaveBeenCalledWithOverridingToken('some_key');
      });

      it('returns the expected Observable with just an asset ID', () => {
        serviceUnderTest.load({ id: '47' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: null, timeEnd: null });
        });
      });

      it('returns the expected Observable with a UUID', () => {
        serviceUnderTest.load({ id: '47', uuid: 'ABCDEFG' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: 'ABCDEFG', timeStart: null, timeEnd: null });
        });
      });

      it('returns the expected Observable with a negative timeStart', () => {
        serviceUnderTest.load({ id: '47', timeStart: '-1' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: null, timeEnd: null });
        });
      });

      it('returns the expected Observable with a zero timeStart', () => {
        serviceUnderTest.load({ id: '47', timeStart: '0' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: 0, timeEnd: null });
        });
      });

      it('returns the expected Observable with a positive timeStart', () => {
        serviceUnderTest.load({ id: '47', timeStart: '1' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: 1, timeEnd: null });
        });
      });

      it('returns the expected Observable with a negative timeEnd', () => {
        serviceUnderTest.load({ id: '47', timeEnd: '-1' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: null, timeEnd: null });
        });
      });

      it('returns the expected Observable with a zero timeEnd', () => {
        serviceUnderTest.load({ id: '47', timeEnd: '0' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: null, timeEnd: 0 });
        });
      });

      it('returns the expected Observable with a positive timeEnd', () => {
        serviceUnderTest.load({ id: '47', timeEnd: '1' }).subscribe(asset => {
          expect(asset).toEqual({ some: 'asset', uuid: null, timeStart: null, timeEnd: 1 });
        });
      });
    });
  });
}
