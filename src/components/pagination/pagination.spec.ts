import { describe, expect, it, beforeEachProviders, inject, injectAsync, TestComponentBuilder } from 'angular2/testing';
import { Pagination } from './pagination';
import { provide } from 'angular2/core';
import { SpyLocation } from 'angular2/src/mock/location_mock';

export function main() {
  describe('Pagination component', () => {
    beforeEachProviders(() => [
      Pagination,
      provide(Location, { useClass: SpyLocation }),
    ]);
    
    it('Should create instance of Pagination',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Pagination).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Pagination).toBeTruthy();
        });
      })
    );
        
    it('Should have a getPageNumber() function that emits a getPage event', inject([Pagination], (pagination) => {
      expect(pagination.getPageNumber).toBeDefined();
      spyOn(pagination.getPage, 'emit');
      pagination.getPageNumber(2);
      expect(pagination.getPage.emit).toHaveBeenCalled();
    }));
  });
}
