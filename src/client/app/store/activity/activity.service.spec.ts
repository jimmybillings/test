import { ActivityService } from './activity.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Activity Service', () => {
    let serviceUnderTest: ActivityService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new ActivityService(mockApiService.injector, null);
    });
  });
}
