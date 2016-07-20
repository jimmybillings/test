import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  CurrentUser,
  describe,
  inject,
  expect,
  it,
  addProviders
} from './imports/test.imports';

import { AppComponent} from './app.component';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        AppComponent
      ]);
    });

    it('Create instance of app and assign the CurrentUser to an instance variable inside of app',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AppComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
          expect(instance instanceof AppComponent).toBeTruthy();
        });
      }));

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
