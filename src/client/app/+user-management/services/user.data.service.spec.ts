import {
  beforeEachProvidersArray,
  beforeEachProviders,
  ResponseOptions,
  MockBackend,
  Response,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { User } from './user.data.service';

export function main() {
  describe('User data service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls', inject([User, MockBackend], (service: User, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._currentUser).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to create a new user', inject([User, MockBackend], (service: User, mockBackend: MockBackend) => {
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/user/register');
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: setUser()
        })
      ));
    }));

    it('Should make a request to get a current user object', inject([User, MockBackend], (service: User, mockBackend: MockBackend) => {
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.get().subscribe((res) => {
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/user/currentUser');
      });
      connection.mockRespond(200);
    }));
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
      'siteName': 'cnn',
      'accountIds': [4]
    };
  }
}
