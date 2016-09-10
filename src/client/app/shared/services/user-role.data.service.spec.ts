import {
  beforeEachProvidersArray,
  MockBackend,
  inject,
  TestBed
} from '../../imports/test.imports';

import { UserRole } from './user-role.data.service';

export function main() {
  describe('User Role data service', () => {
    localStorage.setItem('token', 'thisisamocktoken');

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        UserRole
      ]
    }));
    let connection: any;
    it('Should create instance variables for http, apiconfig, apiUrls', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to create a new user role', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/userRole');
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to get data on a single user role', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.show(1).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/userRole/' + 1);
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(200);
    }));

    it('Should make a search request to get relevant user roles', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.search('admin').subscribe((res: any) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/userRole/search?text=admin');
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to update an existing user role', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.update(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/userRole/' + setUser().id);
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to delete a user role by id', inject([UserRole, MockBackend], (service: UserRole, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.destroy(1).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/userRole/' + 1);
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
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
