import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { UserService } from './user.service';

export function main() {
  describe('User data service', () => {
    let serviceUnderTest: UserService;
    let mockApi: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      serviceUnderTest = new UserService(mockApi.injector);
    });

    describe('get()', () => {
      it('Should make a request to get a user', () => {
        serviceUnderTest.get().subscribe((res) => {
          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('user/currentUser');
        });
      });
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

    describe('forgotPassword()', () => {
      it('Should make a request to get a password reset email', () => {
        serviceUnderTest.forgotPassword(setUser()).subscribe((res) => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user/requestPasswordReset');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithBody(setUser());
        });
      });
    });

    describe('resetPassword()', () => {
      it('Should make a request to change a users password with api token', () => {
        serviceUnderTest.resetPassword(setUser(), '3234234234234').subscribe((res) => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user/passwordReset');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithOverridingToken('3234234234234');
          expect(mockApi.post).toHaveBeenCalledWithBody(setUser());
        });
      });
    });

    describe('downloadActiveTosDocument()', () => {
      beforeEach(() => {
        jasmine.addMatchers(mockApiMatchers);
        mockApi = new MockApiService();
        mockApi.getResponse = [[{ id: 1, activeVersionId: 'abcd1234', name: 'TOS' }], { text: () => { return 'text'; } }];
        serviceUnderTest = new UserService(mockApi.injector);
      });
      it('hits the API correctly', () => {
        serviceUnderTest.downloadActiveTosDocument();
        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/name/TOS');
      });

      it('Should flatmap the response to make another request', () => {
        serviceUnderTest.downloadActiveTosDocument().take(1).subscribe(data => {
          expect(data).toBe('text');
        });

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/name/TOS');
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('document/public/downloadFile/abcd1234');
        expect(mockApi.get).toHaveBeenCalledWithDownload(true);
      });
    });

    describe('agreeUserToTerms', () => {
      it('hits the API correctly', () => {
        serviceUnderTest.activeVersionId = 'abcd1234';
        serviceUnderTest.agreeUserToTerms();

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('document/version/abcd1234/agree');
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
