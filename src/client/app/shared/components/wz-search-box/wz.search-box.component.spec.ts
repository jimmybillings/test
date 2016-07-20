import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../../imports/test.imports';

import {WzSearchBoxComponent} from './wz.search-box.component';

export function main() {
  describe('Search Box Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      WzSearchBoxComponent
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
