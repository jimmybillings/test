import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { AdminService } from './admin.service';
import { ApiConfig } from '../../shared/services/api.config';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { CurrentUser, currentUser } from '../../shared/services/current-user.model';
import { provideStore } from '@ngrx/store';
// import {RouteSegment} from '@angular/router';
// import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';

export function main() {
  describe('Admin Service', () => {

    beforeEachProviders(() => [
      // ROUTER_FAKE_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      // provide(RouteSegment, { useValue: new RouteSegment([], { i: '1', n: '10', s: 'createdOn', d: 'false', fields: '', values: '' }, null, null, null) }),
      provideStore({ currentUser: currentUser }),
      ApiConfig,
      AdminService,
      CurrentUser
    ]);

    it('Should create instance variables for http, and apiConfig', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
    }));

    it('Should have a getIdentitiesSearchOptions function that builds the appropriate RequestOptions given search parameters', inject([AdminService], (service: AdminService) => {
      let params = { i: 2, n: 10, s: 'createdOn', d: 'false', q: '' };
      let actual = service.getIdentitiesSearchOptions(params);
      expect(actual).toBeAnInstanceOf(RequestOptions);
      expect(actual.search).toBeAnInstanceOf(URLSearchParams);
    }));

    it('should have a getResources function that makes a search request for a resource with given params', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      spyOn(service, 'getIdentitiesSearchOptions');
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.getResources({ i: 1, n: 10, s: 'createdOn', d: 'false' }, 'account').subscribe((res) => {
        expect(service.getIdentitiesSearchOptions).toHaveBeenCalledWith(1, 10, 'createdOn', 'false');
      });
    }));

    it('should have a getResources function that makes a searchFields request for a resource with given params', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      spyOn(service, 'getIdentitiesSearchPath').and.callThrough();
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.getResources({ i: 1, n: 10, s: 'createdOn', d: 'false', fields: 'firstName,lastName', values: 'ross,edfort' }, 'account').subscribe((res) => {
        expect(service.getIdentitiesSearchPath).toHaveBeenCalledWith({ i: 1, n: 10, s: 'createdOn', d: 'false', fields: 'firstName,lastName', values: 'ross,edfort' }, 'account');
      });
    }));

    it('Should have a getIdentitiesSearchPath function that returns the proper url', inject([AdminService], (service: AdminService) => {
      let result = service.getIdentitiesSearchPath('account');
      expect(result).toEqual('https://crxextapi.dev.wzplatform.com/api/identities/v1/account/searchFields/?');
    }));

    it('Should have a buildSearchTerm function that calls subsequent functions', inject([AdminService], (service: AdminService) => {
      spyOn(service, 'sanitizeFormInput').and.callThrough();
      spyOn(service, 'buildFields').and.callThrough();
      spyOn(service, 'buildValues').and.callThrough();
      let result = service.buildSearchTerm({ firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05' });
      expect(service.sanitizeFormInput).toHaveBeenCalledWith({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
      expect(service.buildFields).toHaveBeenCalledWith({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
      expect(service.buildValues).toHaveBeenCalledWith({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
      expect(result).toEqual({ fields: 'firstName,lastName,DATE:LT:createdOn', values: 'ross,edfort,1462406400' });
    }));

    it('Should have a sanitizeFormInput function that removes empty params from an object', inject([AdminService], (service: AdminService) => {
      let result = service.sanitizeFormInput({ firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05' });
      expect(result).toEqual({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
    }));

    it('Should have a buildFields function that builds an array proper field params from an object', inject([AdminService], (service: AdminService) => {
      let result = service.buildFields({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
      expect(result).toEqual(['firstName', 'lastName', 'DATE:LT:createdOn', 'createdOn']);
      let otherResult = service.buildFields({ firstName: 'ross', lastName: 'edfort', emailAddress: 'wazee', DATE: 'after', lastUpdated: '2016-05-05' });
      expect(otherResult).toEqual(['firstName', 'lastName', 'emailAddress', 'DATE:GT:lastUpdated', 'lastUpdated']);
    }));

    it('Should have a buildValues function that builds an array proper value params from an object', inject([AdminService], (service: AdminService) => {
      let result = service.buildValues({ firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05' });
      expect(result).toEqual(['ross', 'edfort', 'before', '1462406400']);
    }));
  });
}
