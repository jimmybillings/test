import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AdminService } from './admin.service';
import { ApiConfig } from '../../../common/config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http, RequestOptions, URLSearchParams } from 'angular2/http';
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
    
    it('Should have a _getIdentitiesSearchOptions function that builds the appropriate RequestOptions given search parameters', inject([AdminService], (service) => {
      let params = {i: 2, n: 10, s: 'createdOn', d: 'false', q: ''};
      let actual = service._getIdentitiesSearchOptions(params);
      expect(actual).toBeAnInstanceOf(RequestOptions);
      expect(actual.search).toBeAnInstanceOf(URLSearchParams);
    }));
    
    it('should have a getResources function that makes a search request for a resource with given params', inject([AdminService, MockBackend], (service, mockBackend) => {
      spyOn(service, '_getIdentitiesSearchOptions');
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.getResources({i: 1, n: 10, s: 'createdOn', d: 'false', q: ''}, 'account').subscribe((res) => {
        expect(service._getIdentitiesSearchOptions).toHaveBeenCalledWith(1, 10, 'createdOn', 'false');
      });
    }));
    
    it('should have a getResources function that makes a searchFields request for a resource with given params', inject([AdminService, MockBackend], (service, mockBackend) => {
      spyOn(service, '_getIdentitiesSearchPath');
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      service.getResources({i: 1, n: 10, s: 'createdOn', d: 'false', q: 'fields=firstName,lastName&values=ross,edfort'}, 'account').subscribe((res) => {
        expect(service._getIdentitiesSearchPath).toHaveBeenCalledWith({i: 1, n: 10, s: 'createdOn', d: 'false', q: 'fields=firstName,lastName&values=ross,edfort'}, 'account');
      });
    }));
    
    it('Should have a _getIdentitiesSearchPath function that returns the proper url', inject([AdminService], (service) => {
      let result = service._getIdentitiesSearchPath('account');
      expect(result).toEqual('https://crxextapi.dev.wzplatform.com/api/identities/v1/account/search');
    }));
    
    it('Should have a _getIdentitiesSearchFieldsPath function that returns the proper url', inject([AdminService], (service) => {
      let result = service._getIdentitiesSearchFieldsPath({i: 1, n: 10, s: 'createdOn', d: 'false', q: 'fields=firstName,lastName&values=ross,edfort'}, 'account');
      let base = 'https://crxextapi.dev.wzplatform.com/api/identities/v1/';
      expect(result).toEqual(base + 'account/searchFields/?fields=firstName,lastName&values=ross,edfort&createdOn&false&1&10');
    }));
  });
}
