import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { Router } from '@angular/router';

import {Observable} from 'rxjs/Rx';
import {provide} from '@angular/core';
import {RegisterComponent} from './register.component';
import {HTTP_PROVIDERS} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import {CurrentUser} from '../../shared/services/current-user.model';
import {Authentication} from '../services/authentication.data.service';
import {User} from '../services/user.data.service';
import {UiConfig, config} from '../../shared/services/ui.config';
import {FormModel} from '../../shared/components/wz-form/wz.form.model';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Register Component', () => {

    const res = { 'user': { 'test': 'one' }, token: { token: 'newToken' } };

    class MockUser {
      create() {
        return Observable.of(res);
      }
    }
    class MockRouter { }
    beforeEachProviders(() => [
      RegisterComponent,
      { provide: Router, useClass: MockRouter },
      MockBackend,
      HTTP_PROVIDERS,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(User, { useClass: MockUser }),
      provideStore({ config: config }),
      ApiConfig,
      CurrentUser,
      UiConfig,
      Authentication,
      FormModel
    ]);

    it('Should have a Register instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(RegisterComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof RegisterComponent).toBeTruthy();
        });
      }));

    it('Should register new user and console log the response for now.',
      inject([RegisterComponent], (register: RegisterComponent) => {
        register.onSubmit({
          'firstName': 'first',
          'lastName': 'second',
          'emailAddress': 'third',
          'password': 'fourth',
          'siteName': register._ApiConfig.getPortal()
        });
      }));

  });
}
