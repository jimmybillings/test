import { Authentication } from './authentication.data.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';

export function main() {
  describe('Authentication', () => {
    let serviceUnderTest: Authentication;
    let mockApi: any;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      serviceUnderTest = new Authentication(mockApi.injector);
    });

    describe('create()', () => {
      it('Calls the API correctly', () => {
        serviceUnderTest.create({ userId: 'james@gmail.com', password: 'testpassword' })
          .subscribe(() => {
            expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
            expect(mockApi.post).toHaveBeenCalledWithEndpoint('login');
            expect(mockApi.post).toHaveBeenCalledWithBody({ userId: 'james@gmail.com', password: 'testpassword' });
            expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          });
      });
    });

    describe('destroy()', () => {
      it('Calls the API correctly', () => {
        serviceUnderTest.destroy()
          .subscribe(() => {
            expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
            expect(mockApi.post).toHaveBeenCalledWithEndpoint('invalidate');
          });
      });
    });
  });
}
