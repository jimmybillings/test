import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {provide} from '@angular/core';
import {FooterComponent} from './footer.component';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { TranslateLoader, TranslateStaticLoader, TranslateService} from 'ng2-translate/ng2-translate';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Footer Component', () => {
    beforeEachProviders(() => [
      FooterComponent,
      ROUTER_FAKE_PROVIDERS,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
    ]);

    it('Should have a footer instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(FooterComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof FooterComponent).toBeTruthy();
        });
      }));

    it('Should fire an event to change the current selected language', inject([FooterComponent], (component: FooterComponent) => {
      spyOn(component.onChangeLang, 'emit');
      component.changeLang('fr');
      expect(component.onChangeLang.emit).toHaveBeenCalledWith('fr');
    }));

  });
}
