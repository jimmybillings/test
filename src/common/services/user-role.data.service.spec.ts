import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { UserRole } from './user-role.data.service';
import { ApiConfig } from '../config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';

export function main() {
  describe('User Role data service', () => {
    localStorage.setItem('token', 'thisisamocktoken');
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      UserRole,
      ApiConfig,
    ]);
    let connection;
    it('Should create instance variables for http, apiconfig, apiUrls', inject([UserRole, MockBackend], (service, mockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to create a new user role', inject([UserRole, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(c => connection = c);
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/userRole');
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to get data on a single user role', inject([UserRole, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(c => connection = c);
      service.show(1).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/userRole/' + 1);
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(200);
    }));

    it('Should make a search request to get relevant user roles', inject([UserRole, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(c => connection = c);
      service.search('admin').subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/userRole/search?text=admin');
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to update an existing user role', inject([UserRole, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(c => connection = c);
      service.update(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/userRole/' + setUser().id);
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to delete a user role by id', inject([UserRole, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(c => connection = c);
      service.destroy(1).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/userRole/' + 1);
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(200);
    }));


  });

  function checkAuthInHeader(headers) {
    return headers.filter((header) => (header === 'Authorization'));
  }

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
