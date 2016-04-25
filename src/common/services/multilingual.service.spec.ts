import { it, describe, expect, beforeEachProviders, inject } from 'angular2/testing';
import { provide } from 'angular2/core';
import { MultilingualService, multilingualReducer } from './multilingual.service';
import {TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { provideStore } from '@ngrx/store';
import { Http, BaseRequestOptions } from 'angular2/http';
import { MockBackend } from 'angular2/http/testing';

export function main() {
  describe('Multilingual Service', () => {

    beforeEachProviders(() => [
      MultilingualService,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
      }),
      provideStore({i18n: multilingualReducer})
    ]);
    
    
    it('should at a minimum support english', () => {
      expect(MultilingualService.SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
      expect(MultilingualService.SUPPORTED_LANGUAGES[0].code).toBe('en');
    });
    
    it('Should set the default language to English', inject([MultilingualService], (service) => {
      service.store.select('i18n').subscribe((i18n) => {
        expect(i18n.lang).toBe('en');
      });
    }));
    
    it('Should change the current language', inject([MultilingualService], (service) => {
      spyOn(service.store, 'dispatch').and.callThrough();
      service.setLanguage('fr');
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: '[Multilingual] LANG_CHANGE', payload: { lang: 'fr' } });
      service.store.select('i18n').subscribe((i18n) => {
        expect(i18n.lang).toBe('fr');
      });
    }));

  });

  
}
