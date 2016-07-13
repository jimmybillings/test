import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { provide, PLATFORM_PIPES} from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { TranslateLoader, TranslateStaticLoader, TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {WzSearchBoxComponent} from './wz.search-box.component';
import {UiConfig} from '../../services/ui.config';
import { FormBuilder } from '@angular/forms';

export function main() {
  describe('Search Box Component', () => {
    class Search { }
    class MockRouter { }
    beforeEachProviders(() => [
      WzSearchBoxComponent,
      FormBuilder,
      { provide: Router, useClass: MockRouter },
      BaseRequestOptions,
      MockBackend,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      TranslateService,
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
      UiConfig
    ]);

    it('Should have a search box instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzSearchBoxComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzSearchBoxComponent).toBeTruthy();
        });
      }));

    it('Should create the form object for the search bar', inject([WzSearchBoxComponent], (component: WzSearchBoxComponent) => {
      component.setForm();
      expect(component.searchForm.value).toEqual({ query: '' });
    }));

    it('Should fire an event to logout a user', inject([WzSearchBoxComponent], (component: WzSearchBoxComponent) => {
      component.config = {};
      component.config.pageSize = {};
      component.config.pageSize.value = 25;
      spyOn(component.searchContext, 'emit');
      component.onSubmit('Dogs');
      expect(component.searchContext.emit).toHaveBeenCalledWith('Dogs');
    }));

  });
}
