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
        
    it('Should have a getPageNumber() function that emits a getPage event', inject([Pagination], (component) => {
      component.pagination = {'numberOfPages': 3};
      spyOn(component.getPage, 'emit');
      component.getPageNumber(2);
      expect(component.getPage.emit).toHaveBeenCalledWith(2);
    }));
    
    it('getPageNumber() should return the last page if a page higher than the numbeOfPages is entered', inject([Pagination], (component) => {
      component.pagination = {'numberOfPages': 3};
      spyOn(component.getPage, 'emit');
      component.getPageNumber(7);
      expect(component.getPage.emit).toHaveBeenCalledWith(2);
    }));
    
    it('getPageNumber() should return the first page if a page of 0 or lower is entered', inject([Pagination], (component) => {
      component.pagination = {'numberOfPages': 3};
      spyOn(component.getPage, 'emit');
      component.getPageNumber(-1);
      expect(component.getPage.emit).toHaveBeenCalledWith(0);
    }));
  });
}
