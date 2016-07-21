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

export function main() {
  describe('FilterComponent', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      FilterComponent,
      FilterService
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
      }));
  });
}
