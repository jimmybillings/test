import {
  beforeEachProvidersArray,
  MockBackend,
  inject,
  addProviders
} from '../../imports/test.imports';

import { AdminService } from './admin.service';

export function main() {
  describe('Admin Service', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });

    it('Should create instance variables for http, and apiConfig', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
    }));

    it('should have a getResourceIndex function that makes a search request for a resource with given params', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      spyOn(service, 'getIdentitiesSearchOptions');
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.getResourceIndex({ i: '1', n: '10', s: 'createdOn', d: 'false' }, 'account').subscribe((res) => {
        expect(service.getIdentitiesSearchOptions).toHaveBeenCalledWith(1, 10, 'createdOn', 'false');
      });
    }));

    it('should have a getResourceIndex function that makes a searchFields request for a resource with given params', inject([AdminService, MockBackend], (service: AdminService, mockBackend: MockBackend) => {
      spyOn(service, 'buildUrl').and.callThrough();
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.getResourceIndex({ i: '1', n: '10', s: 'createdOn', d: 'false', fields: 'firstName,lastName', values: 'ross,edfort' }, 'account').subscribe((res) => {
        expect(service.buildUrl).toHaveBeenCalledWith('search', { i: 1, n: 10, s: 'createdOn', d: 'false', fields: 'firstName,lastName', values: 'ross,edfort' }, 'account');
      });
    }));

    it('Should have a buildUrl function that returns the proper url', inject([AdminService], (service: AdminService) => {
      let result = service.buildUrl('search', 'account');
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
