import { PrivacyPolicyService } from './privacy-policy.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Privacy Policy Service', () => {
    let serviceUnderTest: PrivacyPolicyService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new PrivacyPolicyService(mockApiService.injector);
    });
  });
}
