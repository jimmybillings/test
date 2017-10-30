import { PricingService } from './pricing.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Pricing Service', () => {
    let serviceUnderTest: PricingService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new PricingService(mockApiService.injector);
    });
  });
}
