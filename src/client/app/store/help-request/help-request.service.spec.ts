import { HelpRequestService } from './help-request.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Help Request Service', () => {
    let serviceUnderTest: HelpRequestService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new HelpRequestService(mockApiService.injector);
    });
  });
}
