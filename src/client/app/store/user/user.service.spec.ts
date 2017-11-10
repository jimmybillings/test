import { FutureUserService } from './user.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('User Service', () => {
    let serviceUnderTest: FutureUserService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new FutureUserService(mockApiService.injector);
    });
  });
}
