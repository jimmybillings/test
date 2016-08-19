import {
  beforeEachProvidersArray,
  inject,
  addProviders,
} from './imports/test.imports';
import { provide } from '@angular/core';
import { TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { AppComponent} from './app.component';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        provide(TranslateLoader, {
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
        }),
        TranslateService,
        AppComponent
      ]);
    });

    it('Should log out a user', inject([AppComponent], (component: any) => {
      spyOn(component.authentication, 'destroy').and.callThrough();
      spyOn(component.currentUser, 'destroy');
      spyOn(component.collectionsService, 'destroyCollections');
      component.logout();
      expect(component.authentication.destroy).toHaveBeenCalled();
      expect(component.currentUser.destroy).toHaveBeenCalled();
      expect(component.collectionsService.destroyCollections).toHaveBeenCalled();
    }));

    it('Should change the current language', inject([AppComponent], (component: any) => {
      spyOn(component.multiLingual, 'setLanguage');
      component.changeLang({ lang: 'fr' });
      expect(component.multiLingual.setLanguage).toHaveBeenCalledWith({ lang: 'fr' });
    }));
  });
}
