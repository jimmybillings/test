import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../imports/test.imports';

import { FilterComponent } from './filter.component';
import { FilterService } from '../shared/services/filter.service';
import { SearchComponent } from './search.component';

export function main() {
  describe('FilterComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        FilterComponent,
        FilterService,
        SearchComponent
      ]
    }));

    it('Should have an applyFilter() function that calls applyFilter() on the search component',
      inject([FilterComponent], (component: FilterComponent) => {
        spyOn(component.searchComponent, 'applyFilter');
        component.applyFilter(123);
        expect(component.searchComponent.applyFilter).toHaveBeenCalledWith(123);
      }));

  });
}
