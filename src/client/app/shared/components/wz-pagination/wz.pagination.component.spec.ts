import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../../imports/test.imports';

import { WzPaginationComponent } from './wz.pagination.component';

export function main() {
  describe('Pagination component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      WzPaginationComponent
    ]);

    it('Should create instance of Pagination',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzPaginationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzPaginationComponent).toBeTruthy();
        });
      })
    );

    it('Should have a getPageNumber() function that emits a getPage event', inject([WzPaginationComponent], (component: WzPaginationComponent) => {
      component.pagination = { 'numberOfPages': 3 };
      spyOn(component.getPage, 'emit');
      component.getPageNumber(2);
      expect(component.getPage.emit).toHaveBeenCalledWith(2);
    }));

    it('getPageNumber() should return the last page if a page higher than the numbeOfPages is entered', inject([WzPaginationComponent], (component: WzPaginationComponent) => {
      component.pagination = { 'numberOfPages': 3 };
      spyOn(component.getPage, 'emit');
      component.getPageNumber(7);
      expect(component.getPage.emit).toHaveBeenCalledWith(3);
    }));

    it('getPageNumber() should return the first page if a page of 0 or lower is entered', inject([WzPaginationComponent], (component: WzPaginationComponent) => {
      component.pagination = { 'numberOfPages': 3 };
      spyOn(component.getPage, 'emit');
      component.getPageNumber(-1);
      expect(component.getPage.emit).toHaveBeenCalledWith(1);
    }));

    it('turns the input into an integer so a decimal input entered by a user is ok', inject([WzPaginationComponent], (component: WzPaginationComponent) => {
      component.pagination = { 'numberOfPages': 3 };
      spyOn(component.getPage, 'emit');
      component.getPageNumber(1.2367485);
      expect(component.getPage.emit).toHaveBeenCalledWith(1);
    }));

    it('turns the input into an integer so a letter input entered by a user is ok', inject([WzPaginationComponent], (component: WzPaginationComponent) => {
      component.pagination = { 'numberOfPages': 3 };
      spyOn(component.getPage, 'emit');
      component.getPageNumber('adf');
      expect(component.getPage.emit).toHaveBeenCalledWith(1);
    }));
  });
}
