import { DocumentService } from './document.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Document Service', () => {
    let serviceUnderTest: DocumentService;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      mockApi.getResponse = [[{ id: 1, activeVersionId: 'abcd1234', name: 'TOS' }], { text: () => { return 'text'; } }];
      serviceUnderTest = new DocumentService(mockApi.injector);
    });

    describe('downloadActiveTosDocument()', () => {
      it('hits the API correctly', () => {
        serviceUnderTest.downloadActiveTosDocument();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/name/TOS');
      });

      it('Should flatmap the response to make another request', () => {
        serviceUnderTest.downloadActiveTosDocument().take(1).subscribe(data => {
          expect(data).toBe('text');
        });

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/name/TOS');
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/downloadFile/abcd1234');
        expect(mockApi.get).toHaveBeenCalledWithDownload(true);
      });
    });

    describe('agreeUserToTerms', () => {
      it('hits the API correctly', () => {
        serviceUnderTest.activeVersionId = 'abcd1234';
        serviceUnderTest.agreeUserToTerms();

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('document/version/abcd1234/agree');
      });
    });
  });
}
