import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { Authentication } from './authentication.data.service';
import { ApiConfig } from '../config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';

export function main() {
  describe('Authentication data service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ApiConfig,
      Authentication
    ]);

    it('Should create instance variables for http, apiconfig, apiUrls', inject([Authentication, MockBackend], (service, mockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));
    
    it('Should make a request to login a new user', inject([Authentication, MockBackend], (service, mockBackend) => {
      let connection;
      connection = mockBackend.connections.subscribe(c => connection = c);
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot()+'users-api/login');
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(200);
    }));
    
    it('Should make a request to dstroy the login of a user', inject([Authentication, MockBackend], (service, mockBackend) => {
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.destroy(setUser()).subscribe((res) => {
        expect(connection.request.url).toBe(service.apiConfig.getApiRoot()+'users-api/invalidate');
        expect(connection.request.headers._headersMap.entries_[2]).toEqual('Authorization');
      });
      connection.mockRespond(200);
    }));
    
    
  }); 

  function setUser() {
    return {
      'username': 'test@email.com',
      'password': 'password'
    }; 
  }

}
