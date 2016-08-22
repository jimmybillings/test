import {
  beforeEachProvidersArray,
  inject,
  addProviders
} from '../../../imports/test.imports';

import {WzSearchBoxComponent} from './wz.search-box.component';

export function main() {
  describe('Search Box Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        WzSearchBoxComponent
      ]);
    });

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
