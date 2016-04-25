import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AdminService } from './admin.service';
import { ApiConfig } from '../../../common/config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { CurrentUser, currentUser } from '../../../common/models/current-user.model';
import { provideStore } from '@ngrx/store';
import { SpyLocation } from 'angular2/src/mock/location_mock';

export function main() {
  describe('Admin Service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Location, { useClass: SpyLocation }),
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({currentUser: currentUser}),
      ApiConfig,
      AdminService,
      CurrentUser
    ]);

    it('Should create instance variables for http, routeConfig, and apiConfig', inject([AdminService, MockBackend], (service, mockBackend) => {
      expect(service._http).toBeDefined();
      expect(service._apiConfig).toBeDefined();
      expect(service._routeConfig).toBeDefined();
    }));
    
    it('Should create a routeConfig instance variable with default attributes', inject([AdminService], (service) => {
      let config = service._routeConfig;
      expect(config.resource).toEqual('');
      expect(config.q).toEqual('a');
      expect(config.s).toEqual('createdOn');
      expect(config.d).toEqual(false);
      expect(config.i).toEqual(0);
      expect(config.n).toEqual(2);
    }));
    
    it('Should have a buildUrl function that builds the appropriate url given search parameters', inject([AdminService], (service) => {
      spyOn(service, 'buildUrl').and.callThrough();
      let builtUrl = service.buildUrl('account', 2);
      expect(builtUrl).toEqual(service._apiConfig.baseUrl() + 'api/identities/v1/account/search/?q=a&s=createdOn&d=false&i=2&n=2');
    }));
    
    it('should have a getResource function that makes a request for a resource with given params', inject([AdminService, MockBackend], (service, mockBackend) => {
      spyOn(service, 'buildUrl');
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.getResource('user', 1).subscribe((res) => {
        expect(service.buildUrl).toHaveBeenCalledWith('user', 1);
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/user/search/?q=a&s=createdOn&d=false&i=1&n=2');
      });
    }));
  });
}
