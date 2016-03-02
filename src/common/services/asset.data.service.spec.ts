import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AssetData } from './asset.data.service';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from 'angular2/http';

export function main() {
  describe('Asset data service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
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
        service.apiConfig.baseUrl() + service.apiConfig.getAssetSearchPath(loggedIn)
      );
    }));

    it('Should return correct api URL for a logged in user', inject([AssetData, MockBackend], (service, mockBackend) => {
      let loggedIn = true;
      expect(service.searchAssetsUrl(loggedIn)).toEqual(
        service.apiConfig.baseUrl() + service.apiConfig.getAssetSearchPath(loggedIn)
      );
    }));

    it('Should make a request to the search api with the correct url and params', inject(
      [AssetData, MockBackend], (service, mockBackend) => {
        let connection;
        mockBackend.connections.subscribe(c => connection = c);
        service.searchAssets(searchParams()).subscribe((res) => {
          expect(
            connection.request.url).toBe(service.apiConfig.baseUrl() 
            + 'assets-api/clip/anonymous/search?q=green&n=25&siteName=core'
          );
          expect(res).toEqual(mockResponse());
        });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: mockResponse()
        })
      ));
    }));
  }); 

  function searchParams() {
    return {  
      'q':'green',
      'n':'25'
    };
  }
  
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
