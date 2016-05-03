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

    it('Should create instance variables for http, and apiConfig', inject([AdminService, MockBackend], (service, mockBackend) => {
      expect(service._http).toBeDefined();
      expect(service._apiConfig).toBeDefined();
    }));
    
    it('Should have a buildUrl function that builds the appropriate url given search parameters', inject([AdminService], (service) => {
      spyOn(service, 'buildUrl').and.callThrough();
      let builtUrl = service.buildUrl({resource: 'account', i: 2, n: 10, s: 'createdOn', d: 'false', q: ''});
      expect(builtUrl).toEqual(service._apiConfig.baseUrl() + 'api/identities/v1/account/search/?q=&s=createdOn&d=false&i=1&n=10');
    }));
    
    it('should have a getResources function that makes a request for a resource with given params', inject([AdminService, MockBackend], (service, mockBackend) => {
      spyOn(service, 'buildUrl');
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.getResources('user', 1, 10, 'createdOn', 'false').subscribe((res) => {
        expect(service.buildUrl).toHaveBeenCalledWith('user', 1, 10, 'createdOn', 'false');
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/user/search/?q=&s=createdOn&d=false&i=1&n=10');
      });
    }));
  });
}
