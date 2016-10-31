import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { User } from './user.data.service';

export function main() {
  describe('User data service', () => {
    let serviceUnderTest: User;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      serviceUnderTest = new User(mockApi.injector);
    });

    describe('create()', () => {
      it('Should make a request to create a new user', () => {
        serviceUnderTest.create(setUser()).subscribe((res) => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user/register');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithBody(setUser());
        });
      });
    });

    describe('get()', () => {
      it('Should make a request to get a user', () => {
        serviceUnderTest.get().subscribe((res) => {
          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('user/currentUser');
        });
      });
    });

    describe('forgotPassword()', () => {
      it('Should make a request to get a password reset email', () => {
        serviceUnderTest.forgotPassword(setUser()).subscribe((res) => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user/requestPasswordReset');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithParameters(setUser());
        });
      });
    });

    describe('resetPassword()', () => {
      it('Should make a request to change a users password with api token', () => {
        serviceUnderTest.resetPassword(setUser(), '3234234234234').subscribe((res) => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user/passwordReset');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithBody(setUser(), { loading: true, overridingToken: '3234234234234' });
        });
      });
    });

    function setUser() {
      return {
        'lastUpdated': '2016-01-14T16:46:21Z',
        'createdOn': '2016-01-14T16:46:21Z',
        'id': 6,
        'emailAddress': 'test_email@email.com',
        'password': '5daf7de08c0014ec2baa13a64b35a4e0',
        'firstName': 'first',
        'lastName': 'last',
        'siteName': 'core',
        'accountIds': [4]
      };
    }
  });
}
