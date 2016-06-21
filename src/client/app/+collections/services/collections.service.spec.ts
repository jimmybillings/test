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
import { BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod } from '@angular/http';
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
        service.loadCollections().subscribe(response => {
          expect(connection.request.url).toBe(expectedUrl);
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should have a createCollection method that creates a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.createCollection(mockCollection()).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection');
          expect(connection.request.method).toBe(RequestMethod.Post);
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should have a getFocusedCollection method that gets a users focused collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.getFocusedCollection().subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/focused');
          expect(response).toEqual(mockCollectionResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollectionResponse()
          })
        ));
      }));

    it('Should have a setFocusedCollection method that sets a users focused collection given an id',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.setFocusedCollection(158).subscribe(response => {
          expect(connection.request.url).toBe('api/identites/v1/collection/focused/158');
          expect(connection.request.method).toBe(RequestMethod.Put);
          expect(response._body).toEqual(mockCollection());
          expect(response._body.id).toEqual(158);
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a addAssetsToCollection method that adds assets to a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.addAssetsToCollection(158, 567890).subscribe(response => {
          expect(connection.request.method).toBe(RequestMethod.Post);
          expect(connection.request.url).toBe('api/identites/v1/collection/158/addAssets?asset-ids=567890');
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a deleteCollection method that deletes a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.apiUrls.CollectionBaseUrl = 'api/identites/v1/collection';
        service.deleteCollection(158).subscribe(response => {
          expect(connection.request.method).toBe(RequestMethod.Delete);
          expect(connection.request.url).toBe('api/identites/v1/collection/158');
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockCollection()
          })
        ));
      }));

    it('Should have a clearCollections method that sets the store back to its initial state',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.clearCollections();
        expect(service.store.dispatch).toHaveBeenCalled();
      }));

    it('Should have a deleteCollectionFromStore method that removes a collection',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.deleteCollectionFromStore(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'DELETE_COLLECTION', payload: mockCollection() });
      }));

    it('Should have a updateFocusedCollection method that updates the focused collection in the store',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.updateFocusedCollection(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'FOCUSED_COLLECTION', payload: mockCollection()});
      }));

    it('Should have a createCollectionInStore method that creates a new collection in the store',
      inject([CollectionsService, MockBackend], (service: CollectionsService, mockBackend: MockBackend) => {
        spyOn(service.store, 'dispatch');
        service.createCollectionInStore(mockCollection());
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'CREATE_COLLECTION', payload: mockCollection() });
      }));

    function mockCollectionResponse() {
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

    function mockCollection() {
      return {
        'lastUpdated':'2016-06-17T21:44:12Z',
        'createdOn':'2016-06-17T21:44:12Z',
        'id':158,
        'siteName':'core',
        'name':'golf',
        'owner':'ross.edfort@wazeedigital.com',
        'assets':[123456],
        'tags':['golf','green','sport']
      };
    }
  });
}
