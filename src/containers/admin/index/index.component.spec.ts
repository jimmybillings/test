import {
describe,
expect,
injectAsync,
inject,
TestComponentBuilder,
it,
beforeEachProviders
} from 'angular2/testing';

import {Index} from './index.component';
import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser, currentUser} from '../../../common/models/current-user.model';
import {provideStore} from '@ngrx/store';
import {MockBackend} from 'angular2/http/testing';
import {ApiConfig} from '../../../common/config/api.config';

export function main() {
  describe('Admin Index component', () => {
    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Index }),
      provide(Router, { useClass: RootRouter }),
      provideStore({currentUser: currentUser}),
      CurrentUser,
      AdminService,
      ApiConfig,
      Index
    ]);
    
    it('Create instance of index and assign the CurrentUser to an instance variable inside of account',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Index).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Index).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
      
    it('Should create an instance variable of AdminService, CurrentUser, and resource', inject([Index], (index) => {
      expect(index.currentUser).toBeDefined();
      expect(index.adminService).toBeDefined();
      expect(index.resource).toBeDefined();
    }));
      
    it('Should call .index() on init', inject([Index], (index) => {
      spyOn(index, 'getIndex');
      index.ngOnInit();
      expect(index.getIndex).toHaveBeenCalled();
    }));
  });
}
