import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {IndexComponent} from './index.component';
import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {provide, Injectable} from '@angular/core';
// import {RouteSegment} from '@angular/router';
// import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {CurrentUser, currentUser} from '../../shared/services/current-user.model';
import {provideStore} from '@ngrx/store';
import {MockBackend} from '@angular/http/testing';
import {ApiConfig} from '../../shared/services/api.config';
import {UiConfig, config} from '../../shared/services/ui.config';
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

      getResources(resource: any, i: any) {
        return Observable.of(mockResponse());
      }

      getSortedResources(resource: any, attribute: any, toggleOrder: any) {
        return Observable.of(mockResponse());
      }

      setResources(data: any) {
        return true;
      }

      buildSearchTerm() {
        return { fields: 'firstName', values: 'john' };
      }

      buildRouteParams(args: any) {
        return Object.assign({ i: '1', n: '10', s: 'createdOn', d: 'false', fields: '', values: '' }, args);
      }
    }

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      // ROUTER_FAKE_PROVIDERS,
      provide(AdminService, { useClass: MockAdminService }),
      provideStore({ currentUser: currentUser }),
      // provide(RouteSegment, { useValue: new RouteSegment([], { i: '1', n: '10', s: 'createdOn', d: 'false', fields: '', values: '' }, null, null, null) }),
      CurrentUser,
      ApiConfig,
      provideStore({ config: config }),
      UiConfig,
      IndexComponent
    ]);

    it('Create instance of index and assign the CurrentUser to an instance variable inside of account',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(IndexComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof IndexComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));

    it('Should create an instance variable of AdminService, and CurrentUser', inject([IndexComponent], (component: IndexComponent) => {
      expect(component.currentUser).toBeDefined();
      expect(component.adminService).toBeDefined();
    }));

    it('Should have a getIndex() function that calls the getResource and setResources functions on the service',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resource = 'account';
        spyOn(component.adminService, 'getResources').and.callThrough();
        spyOn(component.adminService, 'setResources').and.callThrough();
        component.getIndex();
        expect(component.adminService.getResources)
          .toHaveBeenCalledWith({ i: '1', n: '10', s: 'createdOn', d: 'false', values: '', fields: '' }, 'account');
        expect(component.adminService.setResources)
          .toHaveBeenCalledWith(mockResponse());
      }));

    it('Should have a navigateToPageUrl function that navigates to a URL', inject([IndexComponent], (component: IndexComponent) => {
      component.resource = 'account';
      spyOn(component.router, 'navigate');
      component.navigateToPageUrl(2);
      expect(component.router.navigate)
        .toHaveBeenCalledWith(['/admin/resource/account', Object({ i: 2, n: '10', s: 'createdOn', d: 'false', fields: '', values: '' })]);
    }));

    it('Should have a navigateToSortUrl function that navigates to a URL with correct params', inject([IndexComponent], (component: IndexComponent) => {
      component.resource = 'account';
      spyOn(component.router, 'navigate');
      component.navigateToSortUrl({ s: 'emailAddress', d: true });
      expect(component.router.navigate)
        .toHaveBeenCalledWith(['/admin/resource/account', Object({ i: '1', n: '10', s: 'emailAddress', d: true, fields: '', values: '' })]);
    }));

    it('Should have a navigateToFilterUrl function that navigates to a URL with correct params', inject([IndexComponent], (component: IndexComponent) => {
      component.resource = 'user';
      spyOn(component.router, 'navigate');
      component.navigateToFilterUrl({ firstName: 'john' });
      expect(component.router.navigate)
        .toHaveBeenCalledWith(['/admin/resource/user', Object({ i: 1, n: '10', s: 'createdOn', d: 'false', fields: 'firstName', values: 'john' })]);
    }));
  });

  function mockResponse() {
    return {
      'items': [{
        'lastUpdated': '2016-03-02T17:01:14Z', 'createdOn': '2016-03-02T17:01:14Z', 'id': 1, 'siteName': 'core', 'accountIdentifier': 'default',
        'name': 'Default', 'isAdmin': false, 'status': 'A', 'isDefault': true
      },
        {
          'lastUpdated': '2016-03-08T18:53:52Z', 'createdOn': '2016-03-08T18:53:52Z', 'id': 3, 'siteName': 'cnn', 'accountIdentifier': 'default', 'name': 'Default',
          'isAdmin': false, 'status': 'A', 'isDefault': true
        },
        {
          'lastUpdated': '2016-03-08T20:23:25Z', 'createdOn': '2016-03-08T20:23:25Z', 'id': 4, 'siteName': 'corbis', 'accountIdentifier': 'default', 'name': 'Default',
          'isAdmin': false, 'status': 'A', 'isDefault': true
        }],
      'totalCount': 6,
      'currentPage': 0,
      'pageSize': 20,
      'hasNextPage': false,
      'hasPreviousPage': false,
      'numberOfPages': 1
    };
  }
}
