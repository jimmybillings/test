import { describe, expect, it, beforeEachProviders, inject, injectAsync, TestComponentBuilder } from 'angular2/testing';
import { provide } from 'angular2/core';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {WzList} from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    beforeEachProviders(() => [
      WzList,
      provide(Location, { useClass: SpyLocation })
    ]);
    
    it('Should create instance of WzList',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(WzList).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzList).toBeTruthy();
        });
      })
    );
    
    it('should have a sortBy function that emits a sort event.', inject([WzList], (list) => {
      list._toggleSort = 0;
      spyOn(list.sort, 'emit');
      list.sortBy('createdOn');
      expect(list.sort.emit).toHaveBeenCalledWith({'attr': 'createdOn', 'toggle': true});
    }));
    
    it('should have a sortBy function that emits a sort event with order reversed based on counter', inject([WzList], (list) => {
      list._toggleSort = 1;
      spyOn(list.sort, 'emit');
      list.sortBy('createdOn');
      expect(list.sort.emit).toHaveBeenCalledWith({'attr': 'createdOn', 'toggle': false});
    }));
  });
}
