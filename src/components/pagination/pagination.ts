import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgIf, NgFor, NgClass} from 'angular2/common';

@Component({
  selector: 'pagination',
  templateUrl: 'components/pagination/pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MATERIAL_DIRECTIVES, NgIf, NgFor, NgClass]
})

export class Pagination {
  @Input() pagination;
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Output() getPage = new EventEmitter();
  
  public getNextPage(currentPage): void {
    this.nextPage.emit(currentPage);
  }
  
  public getPrevPage(currentPage): void {
    this.prevPage.emit(currentPage);
  }
  
  public getPageNumber(pageNumber): void {
    this.getPage.emit(pageNumber);
  }
}
