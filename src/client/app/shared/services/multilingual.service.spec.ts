import { MultilingualService } from './multilingual.service';
import { Observable } from 'rxjs/Observable';

export function main() {
  let serviceUnderTest: MultilingualService, mockApiConfig: any, mockStore: any, mockTranslate: any,
    mockState: any;

  beforeEach(() => {
    mockTranslate = { use: jasmine.createSpy('use') };
    mockApiConfig = { baseUrl: 'http://crxextapi.dev.wzplatform.com/', portal: 'core' };
    mockState = { code: 'en', title: 'English' };
    mockStore = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState))
    };
    serviceUnderTest = new MultilingualService(mockTranslate, mockApiConfig, mockStore);
  });

  describe('Multilingual Service', () => {
    describe('constructor', () => {
      it('Should set the default language to English', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: '[Multilingual] LANG_CHANGE',
          payload: { lang: '/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/en' }
        });
      });
    });

    describe('setLanguage', () => {
      it('Should change the current language', () => {
        serviceUnderTest.setLanguage('fr');

        expect(serviceUnderTest.store.dispatch).toHaveBeenCalledWith({
          type: '[Multilingual] LANG_CHANGE',
          payload: { lang: '/crxextapi.dev.wzplatform.com/identities-api/v1/translation/core/fr' }
        });
      });
    });
  });
}
