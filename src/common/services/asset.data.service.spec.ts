import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AssetData, assets } from './asset.data.service';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { provideStore } from '@ngrx/store/dist/index';
import {Observable} from 'rxjs/Rx';

export function main() {
  describe('Asset data service', () => {
    
    class MockAuthentication {
      create() {
        return Observable.of(mockResponse());
      }
    }
    
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({assets: assets}),
      AssetData,
      ApiConfig,
      CurrentUser
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls',
      inject([AssetData, MockBackend], (service, mockBackend) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.currentUser).toBeDefined();
      }));

    it('Should return correct api URL for a logged out user', inject([AssetData, MockBackend], (service, mockBackend) => {
      let loggedIn = false;
      expect(service.searchAssetsUrl(loggedIn)).toEqual(
        service.apiConfig.baseUrl() + service.getAssetSearchPath(loggedIn)
      );
    }));

    it('Should return correct api URL for a logged in user', inject([AssetData, MockBackend], (service, mockBackend) => {
      let loggedIn = true;
      expect(service.searchAssetsUrl(loggedIn)).toEqual(
        service.apiConfig.baseUrl() + service.getAssetSearchPath(loggedIn)
      );
    }));
    
    // it('Should return correct api URL path for a logged out user', inject([ApiConfig], (service) => {
    //   let loggedIn = false;
    //   expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/search/anonymous');
    // }));

    // it('Should return correct api URL path for a logged in user', inject([ApiConfig], (service) => {
    //   let loggedIn = true;
    //   expect(service.getAssetSearchPath(loggedIn)).toEqual('api/assets/v1/search');
    // }));


    // it('Should return correct URL params for a search with logged out user', inject([ApiConfig], (service) => {
    //   let loggedIn = false;
    //   let sOptions = service.getAssetSearchOptions(searchParams(),loggedIn);
    //   expect(sOptions instanceof RequestOptions).toBeTruthy();
    //   expect(sOptions.search.has('siteName')).toBeTruthy();
    //   expect(sOptions.search.get('siteName')).toEqual(service.getPortal());
    // }));

    // it('Should return correct URL params for a search with logged in user', inject([ApiConfig], (service) => {
    //   let loggedIn = true;
    //   let sOptions = service.getAssetSearchOptions(searchParams(),loggedIn);
    //   expect(sOptions instanceof RequestOptions).toBeTruthy();
    //   expect(sOptions.headers instanceof Headers).toBeTruthy();
    //   expect(sOptions.search.get('q')).toEqual('green');
    //   expect(sOptions.search.get('n')).toEqual('25');
    //   expect(!sOptions.search.has('siteName')).toBeTruthy();
    // }));

    // it('Should make a request to the search api with the correct url and params', inject(
    //   [AssetData, MockBackend], (service, mockBackend) => {
       
      
    // }));
  }); 

  // function searchParams() {
  //   return {  
  //     'q':'green',
  //     'n':'25'
  //   };
  // }
  
  function mockResponse() {
    return {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: true,
      items: [{
        assetId: 33438201,
        name: '19F005_038'
      }],
      numberOfPages: 5,
      pageSize: 25,
      totalCount: 122
    };
  }
  
  
}
