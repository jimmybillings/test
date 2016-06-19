import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { CollectionsService, focusedCollection, collections } from './collections.service';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { provide } from '@angular/core';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ResponseOptions, Response } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { Error } from '../../shared/services/error.service';

export function main() {
  describe('Collection service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ROUTER_FAKE_PROVIDERS,
      provideStore({focusedCollection: focusedCollection, collections: collections}),
      CollectionsService,
      ApiConfig,
      CurrentUser,
      Error
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls, and collections',
      inject([CollectionsService], (service: CollectionsService) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.apiUrls).toBeDefined();
        expect(service.collections).toBeDefined();
      }));

    it('Should have a loadCollections method that gets the users collections',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        let expectedUrl = service.apiUrls.CollectionBaseUrl + '/fetchBy?access-level=owner';
        service.loadCollections().subscribe(payload => {
          expect(connection.request.url).toBe(expectedUrl);
          expect(payload).toEqual(mockGetResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockGetResponse()
          })
        ));
      }));

    it('Should have a createCollection method that creates a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.createCollection(mockCreateResponse()).subscribe(payload => {
          expect(connection.request.url).toBe('api/identites/v1/collection');
          expect(payload).toEqual(mockGetResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockGetResponse()
          })
        ));
      }));


    function mockGetResponse() {
      return {
        'items': [
          {'lastUpdated':'2016-06-16T17:53:17Z',
           'createdOn':'2016-06-16T17:53:17Z',
           'id':155,'siteName':'core',
           'name':'Cat',
           'owner':'ross.edfort@wazeedigital.com',
           'assets':[28296444],
           'tags':['meow']}
         ],
           'totalCount':2,
           'currentPage':0,
           'pageSize':2,
           'hasNextPage':false,
           'hasPreviousPage':false,
           'numberOfPages':1
         };
    }

    function mockCreateResponse() {
      return {
        'lastUpdated':'2016-06-17T21:44:12Z',
        'createdOn':'2016-06-17T21:44:12Z',
        'id':158,
        'siteName':'core',
        'name':'golf',
        'owner':'ross.edfort@wazeedigital.com',
        'tags':['golf','green','sport']
      };
    }
  });
}
