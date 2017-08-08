import { AssetService } from './asset.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';

export function main() {
  let serviceUnderTest: AssetService, mockApi: MockApiService, mockStore: any;
  mockApi = new MockApiService();
  jasmine.addMatchers(mockApiMatchers);

  beforeEach(() => {
    serviceUnderTest = new AssetService(mockApi.injector, null);
  });

  xdescribe('Asset Service', () => {
    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
