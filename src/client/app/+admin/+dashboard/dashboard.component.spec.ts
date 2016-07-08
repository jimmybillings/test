import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide, PLATFORM_PIPES} from '@angular/core';
import { DashboardComponent} from './dashboard.component';
import { Router } from '@angular/router';
import { CurrentUser, currentUser} from '../../shared/services/current-user.model';
import { provideStore } from '@ngrx/store';
import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Admin Dashboard component', () => {
    class MockRouter { }
    beforeEachProviders(() => [
      { provide: Router, useClass: MockRouter },
      provideStore({ currentUser: currentUser }),
      CurrentUser,
      MockBackend,
      BaseRequestOptions,
      TranslateService,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
    ]);

    it('Create instance of dashboard and assign the CurrentUser to an instance variable inside of dashboard',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(DashboardComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof DashboardComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
  });
}
