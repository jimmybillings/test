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
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateLoader, TranslateStaticLoader, TranslateService} from 'ng2-translate/ng2-translate';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Footer Component', () => {
    class MockRouter { }
    class MockActivatedRoute { }
    beforeEachProviders(() => [
      { provide: Router, useClass: MockRouter },
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
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
      FooterComponent
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
