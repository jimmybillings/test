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
      serviceUnderTest = new DocumentService(mockApi.injector);
    });

    describe('downloadActiveTosDocument()', () => {
      it('hits the API correctly', () => {
        serviceUnderTest.downloadActiveTosDocument();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/name/TOS');
      });
    });
  });
}