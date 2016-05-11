import { describe, expect, it, beforeEachProviders, inject, TestComponentBuilder } from 'angular2/testing';
import { provide } from 'angular2/core';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import { AdminFilter } from './admin-filter.component';

export function main() {
  describe('Filter component', () => {
    beforeEachProviders(() => [
      AdminFilter,
      provide(Location, { useClass: SpyLocation })
    ]);
    
    it('Should create instance of AdminFilter',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AdminFilter).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AdminFilter).toBeTruthy();
        });
      })
    );
    
    it('should have a onSubmit function that emits a filterSubmit event.', inject([AdminFilter], (component) => {
      spyOn(component.filterSubmit, 'emit');
      component.onSubmit({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
      expect(component.filterSubmit.emit).toHaveBeenCalledWith({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
    }));
    
    it('should have a clearFilters function that emits a clearFilter event.', inject([AdminFilter], (component) => {
      spyOn(component.clearFilter, 'emit');
      component.clearFilters();
      expect(component.clearFilter.emit).toHaveBeenCalled();
    }));
  });
}
