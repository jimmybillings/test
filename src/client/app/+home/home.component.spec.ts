import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  CurrentUser,
  Observable,
  inject,
  addProviders
} from '../imports/test.imports';

import { HomeComponent} from './home.component';
import { UiConfig } from '../shared/services/ui.config';

export function main() {
  describe('Home Component', () => {
    class MockUiConfig {
      get(comp: any) {
        return Observable.of({'config': {'pageSize': {'value': 100}}});
      }
    }

    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        HomeComponent,
        { provide: UiConfig, useClass: MockUiConfig }
      ]);
    });

    it('Should have router, apiConfig, currentUser, searchContext and uiConfig defined',
      inject([HomeComponent], (component: HomeComponent) => {
        expect(component.currentUser).toBeDefined();
        expect(component.router).toBeDefined();
        expect(component.apiConfig).toBeDefined();
        expect(component.currentUser).toBeDefined();
        expect(component.searchContext).toBeDefined();
      }));

    it('Create instance of home and assign the CurrentUser to an instance variable inside of home',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(HomeComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof HomeComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));

    it('Should call the config service for the home component config options', inject([HomeComponent], (component: HomeComponent) => {
      spyOn(component.uiConfig, 'get').and.callThrough();
      component.ngOnInit();
      expect(component.uiConfig.get).toHaveBeenCalledWith('home');
      expect(component.config).toEqual({'pageSize': { 'value': 100 }});
    }));

    it('Should have a newSearchContext() method that creates a new search context',
      inject([HomeComponent], (component: HomeComponent) => {
        component.ngOnInit();
        spyOn(component.searchContext, 'new');
        component.newSearchContext('cat');
        expect(component.searchContext.new).toHaveBeenCalledWith({ q: 'cat', i: 1, n: 100 });
      }));
  });
}
