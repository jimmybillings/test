import { TestComponentBuilder } from '@angular/compiler/testing';
import {
describe,
expect,
inject,
it,
beforeEachProviders
} from '@angular/core/testing';

import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {provide} from '@angular/core';
import {MockBackend} from '@angular/http/testing';
import {ApiConfig} from '../../shared/services/api.config';
import {NewComponent} from './new.component';
import {UiConfig, config} from '../../shared/services/ui.config';
import {provideStore} from '@ngrx/store';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {RouteSegment} from '@angular/router';

export function main() {
  describe('Admin New component', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      ROUTER_FAKE_PROVIDERS,
      provide(Http, {
        useFactory: (backend:any, defaultOptions:any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(RouteSegment, {useValue: new RouteSegment([], { resource: 'user' }, null, null, null)}),
      ApiConfig,
      provideStore({config: config}),
      UiConfig,
      AdminService,
      NewComponent,
    ]);

    it('Should Create instance of New',
      inject([TestComponentBuilder], (tcb:any) => {
        tcb.createAsync(NewComponent).then((fixture:any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof NewComponent).toBeTruthy();
        });
      }));

      it('Should have an onSubmit function that accepts form data and calls the service', inject([NewComponent], (component:NewComponent) => {
        component.resource = 'user';
        component.currentComponent = 'user';
        component.siteName = 'core';
        spyOn(component.adminService, 'postResource').and.callThrough();
        let formData = {firstName: 'John', lastName: 'Smith', emailAddress: 'johnsmith@email.com', password: 'password'};
        component.onSubmit(formData);
        expect(component.adminService.postResource).toHaveBeenCalledWith(formData, 'user');
      }));

      it('Should have a postResource function that returns an observable', inject([NewComponent], (component:NewComponent) => {
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
