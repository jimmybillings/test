import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { User } from './user.data.service';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';

export function main() {
  describe('User data service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      User,
      ApiConfig,
      CurrentUser
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls', inject([User, MockBackend], (service, mockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._currentUser).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to create a new user', inject([User, MockBackend], (service, mockBackend) => {
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/user/register');
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));

    it('Should make a request to get a current user object', inject([User, MockBackend], (service, mockBackend) => {
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.get().subscribe((res) => {
        let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        expect(authorizationHeader).toEqual(['Authorization']);
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot() + 'api/identities/user/currentUser');
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
