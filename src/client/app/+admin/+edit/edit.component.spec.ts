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
import {EditComponent} from './edit.component';
import {UiConfig, config} from '../../shared/services/ui.config';
import {provideStore} from '@ngrx/store';
import {ROUTER_FAKE_PROVIDERS} from '@angular/router/testing';
import {RouteSegment} from '@angular/router';
import {Observable} from 'rxjs/Rx';

export function main() {
  describe('Admin Edit component', () => {

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
      EditComponent,
    ]);

    it('Should Create instance of Edit',
      inject([TestComponentBuilder], (tcb:any) => {
        tcb.createAsync(EditComponent).then((fixture:any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof EditComponent).toBeTruthy();
        });
      }));

    it('Should have an onSubmit method that takes the form input and hits the service',
      inject([EditComponent], (component: EditComponent) => {
        spyOn(component.adminService, 'put').and.returnValue(Observable.of(mockCurrentResource()));
        spyOn(component.router, 'navigate').and.returnValue(true);
        component.currentResource = mockCurrentResource();
        component.resourceId = '25';
        component.resource = 'user';
        component.onSubmit(mockFormInput());
        expect(component.currentResource).toEqual({
          'lastUpdated':'2016-06-20T17:07:41Z',
          'createdOn':'2016-04-19T16:16:15Z',
          'id':25,
          'siteName':'core',
          'emailAddress':'bob.smith@email.com',
          'userName':'bobsmith',
          'password':'1d411073589938703696d15de48e38f4',
          'firstName':'Bob',
          'lastName':'Smith',
          'permissions':['Root'],
          'accountIds':[1],
          'ownedCollections':[155,156,159,172],
          'focusedCollection':172
        });
        expect(component.adminService.put).toHaveBeenCalledWith('user', '25', component.currentResource);
        expect(component.router.navigate).toHaveBeenCalledWith(['/admin/resource/', 'user']);
      }));

    function mockCurrentResource() {
      return {
        'lastUpdated':'2016-06-20T17:07:41Z',
        'createdOn':'2016-04-19T16:16:15Z',
        'id':25,
        'siteName':'core',
        'emailAddress':'ross.edfort@wazeedigital.com',
        'userName':'rossedfort',
        'password':'1d411073589938703696d15de48e38f4',
        'firstName':'Ross',
        'lastName':'Edfort',
        'permissions':['Root'],
        'accountIds':[1],
        'ownedCollections':[155,156,159,172],
        'focusedCollection':172
      };
    }

    function mockFormInput() {
      return {
        'firstName': 'Bob',
        'lastName': 'Smith',
        'emailAddress': 'bob.smith@email.com',
        'userName': 'bobsmith'
      };
    }
  });
}
