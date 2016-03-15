import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { ApiConfig } from './api.config';
import { BaseRequestOptions, RequestOptions, Http, Headers} from 'angular2/http';

export function main() {
  describe('Api config', () => {

    beforeEachProviders(() => [
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [BaseRequestOptions, RequestOptions]
      }),
      ApiConfig
    ]);

    it('Should return the api root path',
      inject([ApiConfig], (service) => {
        expect(service.baseUrl()).toEqual('https://crxextapi.dev.wzplatform.com/');
      }));

    it('Should create an instance of authorization headers, with correct header info',
      inject([ApiConfig], (service) => {
        expect(service.authHeaders() instanceof Headers).toBeTruthy();
        expect(service.authHeaders().has('Content-Type')).toBeTruthy();
        expect(service.authHeaders().getAll('Content-Type')).toEqual(['application/json']);
        expect(service.authHeaders().has('Authorization')).toBeTruthy();
        expect(service.authHeaders().getAll('Authorization')).toEqual(['Bearer null']);
        expect(service.authHeaders().has('Accept')).toBeTruthy();
        expect(service.authHeaders().getAll('Accept')).toEqual(['application/json']);
      }));
      
    it('Should create an instance of api headers, with correct header info',
      inject([ApiConfig], (service) => {
        expect(service.headers() instanceof Headers).toBeTruthy();
        expect(service.headers().has('Content-Type')).toBeTruthy();
        expect(service.headers().getAll('Content-Type')).toEqual(['application/json']);
        expect(service.authHeaders().has('Accept')).toBeTruthy();
        expect(service.authHeaders().getAll('Accept')).toEqual(['application/json']);
      }));
      
    it('should return portal name. If none is set, it should return "core"', inject([ApiConfig], (service) => {
      expect(service.getPortal()).toEqual('core');
    }));
      
    it('Should set portal name with value passed in', inject([ApiConfig], (service) => {
      let portalName = 'newportalname';
      service.setPortal(portalName);
      expect(service.getPortal()).toEqual(portalName);
    }));
      
    it('Should return correct api URL path for a logged out user', inject([ApiConfig], (service) => {
      let loggedIn = false;
      expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/clip/anonymous/search');
    }));

    it('Should return correct api URL path for a logged in user', inject([ApiConfig], (service) => {
      let loggedIn = true;
      expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/clip/search');
    }));


    it('Should return correct URL params for a search with logged out user', inject([ApiConfig], (service) => {
      let loggedIn = false;
      let sOptions = service.getAssetSearchOptions(searchParams(),loggedIn);
      expect(sOptions instanceof RequestOptions).toBeTruthy();
      expect(sOptions.search.has('siteName')).toBeTruthy();
      expect(sOptions.search.get('siteName')).toEqual(service.getPortal());
    }));

    it('Should return correct URL params for a search with logged in user', inject([ApiConfig], (service) => {
      let loggedIn = true;
      let sOptions = service.getAssetSearchOptions(searchParams(),loggedIn);
      expect(sOptions instanceof RequestOptions).toBeTruthy();
      expect(sOptions.headers instanceof Headers).toBeTruthy();
      expect(sOptions.search.get('q')).toEqual('green');
      expect(sOptions.search.get('n')).toEqual('25');
      expect(!sOptions.search.has('siteName')).toBeTruthy();
    }));
  });

  function searchParams() {
    return {  
      'q':'green',
      'n':'25'
    };
  }
}
