import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../imports/test.imports';

import { FilterComponent } from './filter.component';
import { FilterService } from './services/filter.service';
import { SearchComponent } from './search.component';

export function main() {
  describe('FilterComponent', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      FilterComponent,
      FilterService,
      SearchComponent
    ]);

    it('Should create instance of filter',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(FilterComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof FilterComponent).toBeTruthy();
        });
      }));

    it('Should create an instance of filterService',
      inject([FilterComponent], (component: FilterComponent) => {
        expect(component.filterService).toBeDefined();
        expect(component.searchComponent).toBeDefined();
      }));

    it('Should have an applyFilter() function that calls applyFilter() on the search component',
      inject([FilterComponent], (component: FilterComponent) => {
        spyOn(component.searchComponent, 'applyFilter');
        component.applyFilter('some filter');
        expect(component.searchComponent.applyFilter).toHaveBeenCalledWith('some filter');
      }));
  });
}
