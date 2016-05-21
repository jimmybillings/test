import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { MultilingualService, multilingualReducer } from './multilingual.service';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { provideStore } from '@ngrx/store';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Multilingual Service', () => {

    beforeEachProviders(() => [
      MultilingualService,
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
      provideStore({ i18n: multilingualReducer })
    ]);


    it('should at a minimum support english', () => {
      expect(MultilingualService.SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
      expect(MultilingualService.SUPPORTED_LANGUAGES[0].code).toBe('en');
    });

    it('Should set the default language to English', inject([MultilingualService], (service: MultilingualService) => {
      service.store.select('i18n').subscribe((i18n: any) => {
        expect(i18n.lang).toBe('en');
      });
    }));

    it('Should change the current language', inject([MultilingualService], (service: MultilingualService) => {
      spyOn(service.store, 'dispatch').and.callThrough();
      service.setLanguage('fr');
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: '[Multilingual] LANG_CHANGE', payload: { lang: 'fr' } });
      service.store.select('i18n').subscribe((i18n: any) => {
        expect(i18n.lang).toBe('fr');
      });
    }));

  });


}
