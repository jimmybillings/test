import {
  beforeEachProvidersArray,
  TestBed,
  inject
} from '../../imports/test.imports';

import { MultilingualService } from './multilingual.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApiConfig } from './api.config';

import { Http } from '@angular/http';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n', '.json');
}

class MockApiConfig {
  public get portal(): string {
    return 'core';
  }
  public get baseUrl(): string {
    return 'http://crxextapi.dev.wzplatform.com/';
  }
}

export function main() {
  describe('Multilingual Service', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [Http]
            }
          })
        ],
        providers: [
          ...beforeEachProvidersArray,
          MultilingualService,
          { provide: ApiConfig, useClass: MockApiConfig },
        ]
      });
    });

    it('should at a minimum support english', () => {
      expect(MultilingualService.SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
      expect(MultilingualService.SUPPORTED_LANGUAGES[0].code).toBe('en');
    });

    it('Should set the default language to English', inject([MultilingualService], (service: MultilingualService) => {
      service.store.select('i18n').subscribe((i18n: any) => {
        expect(i18n.lang).toBe('/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/en');
      });
    }));

    it('Should change the current language', inject([MultilingualService], (service: MultilingualService) => {
      spyOn(service.store, 'dispatch').and.callThrough();
      service.setLanguage('fr');
      expect(service.store.dispatch).toHaveBeenCalledWith(
        { type: '[Multilingual] LANG_CHANGE', payload: { lang: '/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/fr' } });
      service.store.select('i18n').subscribe((i18n: any) => {
        expect(i18n.lang).toBe('/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/fr');
      });
    }));
  });
}
