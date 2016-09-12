import {
  beforeEachProvidersArray,
  Observable,
  inject,
  TestBed
} from '../imports/test.imports';

import { ChangeDetectorRef } from '@angular/core';
import { HomeComponent} from './home.component';
import { UiConfig } from '../shared/services/ui.config';

export function main() {
  describe('Home Component', () => {
    class MockUiConfig {
      get(comp: any) {

        return Observable.of({ 'config': { 'pageSize': { 'value': '100' }, 'notifications': { 'items': [{ 'trString': 'NOTIFICATION.NEW_USER', 'theme': 'success', 'type': 'confirmed=true' }] } } });
      }
    }
    class MockChangeDetectorRef {
      markForCheck() { return true; };
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        HomeComponent,
        { provide: UiConfig, useClass: MockUiConfig },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef }
      ]
    }));

    it('Should have apiConfig, currentUser, searchContext and uiConfig defined',
      inject([HomeComponent], (component: HomeComponent) => {
        expect(component.currentUser).toBeDefined();
        expect(component.apiConfig).toBeDefined();
        expect(component.uiConfig).toBeDefined();
        expect(component.searchContext).toBeDefined();
      }));

    it('Should call the config service for the home component config options', inject([HomeComponent], (component: HomeComponent) => {
      spyOn(component.uiConfig, 'get').and.callThrough();
      component.ngOnInit();
      expect(component.uiConfig.get).toHaveBeenCalledWith('home');
      expect(component.config).toEqual({ 'pageSize': { 'value': '100' }, 'notifications': { 'items': [{ 'trString': 'NOTIFICATION.NEW_USER', 'theme': 'success', 'type': 'confirmed=true' }] } });
    }));

    it('Should have a newSearchContext() method that creates a new search context',
      inject([HomeComponent], (component: HomeComponent) => {
        spyOn(component.searchContext, 'new');
        component.ngOnInit();
        component.newSearchContext('cat');
        expect(component.searchContext.new).toHaveBeenCalledWith({ q: 'cat', i: 1, n: '100' });
      }));
  });
}
