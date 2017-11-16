import { PageDataService } from './page-data.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Page Data Service', () => {
    let serviceUnderTest: PageDataService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new PageDataService(mockApiService.injector);
    });
  });
}
