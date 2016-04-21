import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';

@Component({
  selector: 'pagination',
  templateUrl: 'components/pagination/pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MATERIAL_DIRECTIVES]
})

export class Pagination {
  @Input() currentPageNumber;
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Output() getPage = new EventEmitter();
  
  public getNextPage(currentPage): void {
    this.nextPage.emit(currentPage + 1);
  }
  
  public getPrevPage(currentPage): void {
    currentPage === 0 ? this.prevPage.emit(currentPage) : this.prevPage.emit(currentPage - 1);
  }
  
  public getPageNumber(pageNumber): void {
    this.getPage.emit(pageNumber);
  }
}
