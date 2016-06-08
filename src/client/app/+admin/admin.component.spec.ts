import {TestComponentBuilder} from '@angular/compiler/testing';
import {
describe,
expect,
inject,
it,
beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {CurrentUser, currentUser} from '../shared/services/current-user.model';
import {ROUTER_FAKE_PROVIDERS} from '@angular/router/testing';
import {AdminComponent} from './admin.component';
import {provideStore} from '@ngrx/store';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';

export function main() {
  describe('Admin Component', () => {
    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      provideStore({currentUser: currentUser}),
      CurrentUser,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      })
    ]);

    it('Should have an admin instance',
      inject([TestComponentBuilder], (tcb:any) => {
        tcb.createAsync(AdminComponent).then((fixture:any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AdminComponent).toBeTruthy();
        });
      }));
  });
}
