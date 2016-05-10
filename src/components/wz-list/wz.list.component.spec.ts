import { describe, expect, it, beforeEachProviders, inject, TestComponentBuilder } from 'angular2/testing';
import { provide } from 'angular2/core';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import { WzList } from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    beforeEachProviders(() => [
      WzList,
      provide(Location, { useClass: SpyLocation })
    ]);
    
    it('Should create instance of WzList',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(WzList).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzList).toBeTruthy();
        });
      })
    );
    
    it('should have a sortBy function that emits a sort event.', inject([WzList], (component) => {
      spyOn(component.sort, 'emit');
      component.sortBy('createdOn');
      expect(component.sort.emit).toHaveBeenCalledWith({ attr: 'createdOn', toggle: true });
    }));
  });
}
