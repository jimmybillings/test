import {
describe,
expect,
inject,
TestComponentBuilder,
it,
beforeEachProviders
} from 'angular2/testing';

import {Index} from './index.component';
import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from 'angular2/http';
import {provide, Injectable} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser, currentUser} from '../../../common/models/current-user.model';
import {provideStore} from '@ngrx/store';
import {MockBackend} from 'angular2/http/testing';
import {ApiConfig} from '../../../common/config/api.config';
import {UiConfig, config} from '../../../common/config/ui.config';
import {Observable} from 'rxjs/Rx';
import {Store} from '@ngrx/store';

export function main() {
  describe('Admin Index component', () => {
    @Injectable()
    class MockAdminService {
      public adminStore: Observable<any>;
      constructor(public store: Store<any>) {
        this.adminStore = this.store.select('adminResources');
      }
      
      getResources(resource, i) {
        return Observable.of(mockResponse());
      }
      
      getSortedResources(resource, attribute, toggleOrder) {
        return Observable.of(mockResponse());
      }
      
      setResources(data) {
        return true;
      }
    }
    
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(AdminService, { useClass: MockAdminService }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Index }),
      provide(Router, { useClass: RootRouter }),
      provideStore({currentUser: currentUser}),
      provide(RouteParams, { useValue: new RouteParams({ i: '1', n: '10', s: 'createdOn', d: 'false'}) }),
      CurrentUser,
      ApiConfig,
      provideStore({config: config}),
      UiConfig,
      Index
    ]);
    
    it('Create instance of index and assign the CurrentUser to an instance variable inside of account',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(Index).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Index).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
      
    it('Should create an instance variable of AdminService, and CurrentUser', inject([Index], (component) => {
      expect(component.currentUser).toBeDefined();
      expect(component.adminService).toBeDefined();
    }));
    
    it('Should have a getIndex() function that calls the getResource and setResources functions on the service', inject([Index], (component) => {
      component.resource = 'account';
      component.pageSize = {'value': '10'};
      spyOn(component.adminService, 'getResources').and.callThrough();
      spyOn(component.adminService, 'setResources').and.callThrough();
      component.getIndex();
      expect(component.adminService.getResources).toHaveBeenCalledWith({i: 1, n: 10, s: 'createdOn', d: true, values: '', fields: ''}, 'account');
      expect(component.adminService.setResources).toHaveBeenCalledWith(mockResponse());
    }));
    
    it('Should have a navigateToPageUrl function that navigates to a URL', inject([Index], (component) => {
      component.currentComponent = 'Account';
      component.pageSize = {'value': '10'};
      spyOn(component.router, 'navigate');
      component.navigateToPageUrl(2);
      expect(component.router.navigate).toHaveBeenCalledWith([ '/Admin/Account', Object({ i: 2, n: 10, s: 'createdOn', d: true, fields: '', values: ''}) ]);
    }));
    
    it('Should have a navigateToSortUrl function that navigates to a URL with correct params', inject([Index], (component) => {
      component.currentComponent = 'Account';
      component.pageSize = {'value': '10'};
      spyOn(component.router, 'navigate');
      component.navigateToSortUrl({attr: 'emailAddress', toggle: true});
      expect(component.router.navigate).toHaveBeenCalledWith([ '/Admin/Account', Object({ i: 1, n: 10, s: 'emailAddress', d: true, fields: '', values: ''}) ]);
    }));
    
    it('Should have a navigateToFilterUrl function that navigates to a URL with correct params', inject([Index], (component) => {
      component.currentComponent = 'User';
      component.pageSize = {'value': '10'};
      spyOn(component.router, 'navigate');
      component.navigateToFilterUrl({firstName: 'john'});
      expect(component.router.navigate).toHaveBeenCalledWith([ '/Admin/User', Object({ i: 1, n: '10', s: 'createdOn', d: true, fields: 'firstName', values: 'john' }) ]);
    }));
    
    it('Should have a buildSearchTerm function that calls subsequent functions', inject([Index], (component) => {
      spyOn(component, '_sanitizeFormInput').and.callThrough();
      spyOn(component, '_buildFields').and.callThrough();
      spyOn(component, '_buildValues').and.callThrough();
      let result = component._buildSearchTerm({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
      expect(component._sanitizeFormInput).toHaveBeenCalledWith({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
      expect(component._buildFields).toHaveBeenCalledWith({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
      expect(component._buildValues).toHaveBeenCalledWith({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
      expect(result).toEqual({fields: 'firstName,lastName,DATE:LT:createdOn', values: 'ross,edfort,1462406400'});
    }));
    
    it('Should have a _sanitizeFormInput function that removes empty params from an object', inject([Index], (component) => {
      let result = component._sanitizeFormInput({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
      expect(result).toEqual({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
    }));
    
    it('Should have a _buildFields function that builds an array proper field params from an object', inject([Index], (component) => {
      let result = component._buildFields({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
      expect(result).toEqual(['firstName', 'lastName', 'DATE:LT:createdOn', 'createdOn']);
      let otherResult = component._buildFields({firstName: 'ross', lastName: 'edfort', emailAddress: 'wazee', DATE: 'after', lastUpdated: '2016-05-05'});
      expect(otherResult).toEqual(['firstName', 'lastName', 'emailAddress', 'DATE:GT:lastUpdated', 'lastUpdated']);
    }));
    
    it('Should have a _buildValues function that builds an array proper value params from an object', inject([Index], (component) => {
      let result = component._buildValues({firstName: 'ross', lastName: 'edfort', DATE: 'before', createdOn: '2016-05-05'});
      expect(result).toEqual(['ross', 'edfort', 'before', '1462406400']);
    }));
  });
  
  function mockResponse() {
    return {'items': [{'lastUpdated': '2016-03-02T17:01:14Z', 'createdOn': '2016-03-02T17:01:14Z','id': 1,'siteName': 'core','accountIdentifier': 'default','name': 'Default','isAdmin': false,'status': 'A','isDefault': true},
                      {'lastUpdated': '2016-03-08T18:53:52Z','createdOn': '2016-03-08T18:53:52Z','id': 3,'siteName': 'cnn','accountIdentifier': 'default','name': 'Default','isAdmin': false,'status': 'A','isDefault': true},
                      {'lastUpdated': '2016-03-08T20:23:25Z','createdOn': '2016-03-08T20:23:25Z','id': 4,'siteName': 'corbis','accountIdentifier': 'default','name': 'Default','isAdmin': false,'status': 'A','isDefault': true}],
            'totalCount': 6,
            'currentPage': 0,
            'pageSize': 20,
            'hasNextPage': false,
            'hasPreviousPage': false,
            'numberOfPages': 1
    };
  }
}
