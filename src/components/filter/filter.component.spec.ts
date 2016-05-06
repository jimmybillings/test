import { describe, expect, it, beforeEachProviders, inject, TestComponentBuilder } from 'angular2/testing';
import { provide } from 'angular2/core';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import { Filter } from './filter.component';

export function main() {
  describe('Filter component', () => {
    beforeEachProviders(() => [
      Filter,
      provide(Location, { useClass: SpyLocation })
    ]);
    
    it('Should create instance of Filter',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(Filter).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Filter).toBeTruthy();
        });
      })
    );
    
    it('should have a onSubmit function that emits a filterSubmit event.', inject([Filter], (component) => {
      spyOn(component.filterSubmit, 'emit');
      component.onSubmit({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
      expect(component.filterSubmit.emit).toHaveBeenCalledWith({firstName: 'ross', lastName: 'edfort', emailAddress: '', DATE: 'before', createdOn: '2016-05-05'});
    }));
    
    it('should have a clearFilters function that emits a clearFilter event.', inject([Filter], (component) => {
      spyOn(component.clearFilter, 'emit');
      component.clearFilters();
      expect(component.clearFilter.emit).toHaveBeenCalled();
    }));
  });
}
