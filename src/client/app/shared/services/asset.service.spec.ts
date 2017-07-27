import { AssetService } from './asset.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';

export function main() {
  let serviceUnderTest: AssetService, mockApi: MockApiService, mockStore: any;
  mockApi = new MockApiService();
  mockStore = { dispatch: jasmine.createSpy('dispatch') };
  jasmine.addMatchers(mockApiMatchers);

  beforeEach(() => {
    serviceUnderTest = new AssetService(mockStore, mockApi.injector, null);
  });

  describe('Asset Service', () => {
    describe('initialize()', () => {
      it('Should call the api endpoint for Asset and return a correctly formatted payload to cache in the Asset Store', () => {
        serviceUnderTest.initialize(26307591);

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('clip/26307591/clipDetail');
      });

      it('should set the response in the store', () => {
        serviceUnderTest.initialize(26307591);

        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'SET_ASSET', payload: mockApi.getResponse });
      });
    });
  });
}
