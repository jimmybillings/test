import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgIf, NgFor, NgClass} from 'angular2/common';
import { FORM_DIRECTIVES, FormBuilder, Validators } from 'angular2/common';

@Component({
  selector: 'pagination',
  templateUrl: 'components/pagination/pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, NgIf, NgFor, NgClass]
})

/**
 * The Pagination component takes an input of the Pagination Object that is returned with 
 * all API calls. It ouputs a getPage event with the pageNumber for the API to get.
 */
export class Pagination {
  @Input() pagination;
  @Output() getPage = new EventEmitter();
  
  public form: Object;
  public currentPage = Number;
  
  constructor(public fb: FormBuilder) {
    this.form = fb.group({
      page: ['1' ,Validators.required]
    });
  }
  
  public getPageNumber(pageNumber): void {
    if (pageNumber <= 0) {
      this.getPage.emit(1);
    } else if (pageNumber > this.pagination.numberOfPages) {
      this.getPage.emit(this.pagination.numberOfPages);
    } else {
      this.getPage.emit(pageNumber);
    } 
  }
}
