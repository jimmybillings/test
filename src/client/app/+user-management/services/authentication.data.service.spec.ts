import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { Authentication } from './authentication.data.service';
import { ApiConfig } from '../../shared/services/api.config';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';

export function main() {
  describe('Authentication data service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ApiConfig,
      Authentication
    ]);

    it('Should create instance variables for http, apiconfig, apiUrls', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to login a new user', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      let connection: any;
      connection = mockBackend.connections.subscribe((c: any) => connection = c);
      service.create(setUser()).subscribe((res: any) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/login');
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: setUser()
        })
      ));
    }));

    it('Should make a request to destroy the login of a user', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.destroy().subscribe((res: any) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/invalidate');
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {}
        })
      ));
    }));


  });

  // function checkAuthInHeader(headers: any) {
  //   return headers.filter((header: any) => (header === 'Authorization'));
  // }

  function setUser() {
    return {
      'username': 'test@email.com',
      'password': 'password'
    };
  }

}
