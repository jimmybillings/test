import { TranslateService } from './translate.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Translate Service', () => {
    let serviceUnderTest: TranslateService;
    let mockApi: MockApiService;
    let mockTranslateResponse: any = { items: [{ id: 1 }] };

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      mockApi.getResponse = mockTranslateResponse;
      serviceUnderTest = new TranslateService(mockApi.injector);
    });

    describe('getTrStrings()', () => {
      it('should call the api correctly', () => {
        serviceUnderTest.getTrStrings('core', 'en');

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('translation/core/en.json');
      });
    });

    describe('put()', () => {
      it('should call the api correctly', () => {
        serviceUnderTest.put('newTrString', 'core', 'en').take(1).subscribe();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('translation/searchFields');
        expect(mockApi.get).toHaveBeenCalledWithParameters({ fields: 'siteName,language', values: 'core,en' });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('translation/1');
        expect(mockApi.put).toHaveBeenCalledWithBody({ id: 1, siteName: 'core', language: 'en', name: 'core_en', text: 'newTrString' });
      });
    });
  });
}