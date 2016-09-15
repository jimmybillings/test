import {
  beforeEachProvidersArray,
  TestBed,
  inject
} from '../../imports/test.imports';

import { MultilingualService } from './multilingual.service';
import { TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';

export function main() {
  describe('Multilingual Service', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        {
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
        },
        TranslateService,
        MultilingualService
      ]
    }));

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
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: '[Multilingual] LANG_CHANGE', payload: { lang: '/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/fr' } });
      service.store.select('i18n').subscribe((i18n: any) => {
        expect(i18n.lang).toBe('/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/fr');
      });
    }));
  });
}
