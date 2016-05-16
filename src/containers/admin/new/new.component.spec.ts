import {
describe,
expect,
inject,
TestComponentBuilder,
it,
beforeEachProviders
} from 'angular2/testing';

import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {MockBackend} from 'angular2/http/testing';
import {ApiConfig} from '../../../common/config/api.config';
import {New} from './new.component';
import {UiConfig, config} from '../../../common/config/ui.config';
import {provideStore} from '@ngrx/store';

export function main() {
  describe('Admin New component', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: New }),
      provide(Router, { useClass: RootRouter }),
      provide(RouteParams, { useValue: new RouteParams({ resource: 'user' }) }),
      ApiConfig,
      provideStore({config: config}),
      UiConfig,
      AdminService,
      New,
    ]);

    it('Should Create instance of New',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(New).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof New).toBeTruthy();
        });
      }));

      it('Should have an onSubmit function that accepts form data and calls the service', inject([New], (component) => {
        component.resource = 'user';
        component.currentComponent = 'user';
        component.siteName = 'core';
        spyOn(component.adminService, 'postResource').and.callThrough();
        let formData = {firstName: 'John', lastName: 'Smith', emailAddress: 'johnsmith@email.com', password: 'password'};
        component.onSubmit(formData);
        expect(component.adminService.postResource).toHaveBeenCalledWith(formData, 'user');
      }));

      it('Should have a postResource function that returns an observable', inject([New], (component) => {
        component.resource = 'user';
        component.currentComponent = 'user';
        component.siteName = 'core';
        let formData = {firstName: 'John', lastName: 'Smith', emailAddress: 'johnsmith@email.com', password: 'password'};
        spyOn(component.router, 'navigate').and.callThrough();
        component.adminService.postResource(formData, component.resource).subscribe(data => {
          expect(data).toBe(formData);
          expect(component.router.navigate).toHaveBeenCalledWith(['/Admin/User']);
        });
      }));
  });
}
