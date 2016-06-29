import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {NotificationComponent} from './notification.component';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { provide} from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Notification Component', () => {

    beforeEachProviders(() => [
      NotificationComponent,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      TranslateService,
      MockBackend, 
      BaseRequestOptions
    ]);

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(NotificationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof NotificationComponent).toBeTruthy();
        });
      }));
  });
}
