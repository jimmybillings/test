import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgIf, NgFor, NgClass} from 'angular2/common';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup } from 'angular2/common';

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
  @Input() currentPage;
  @Output() getPage = new EventEmitter();
  
  public form: ControlGroup;
  
  constructor(public fb: FormBuilder) {}
  
  ngOnInit() {
    this.form = this.fb.group({
      page: [this.currentPage, Validators.required]
    });
  }
  
  public getPageNumber(pageNumber): void {
    pageNumber = Number(pageNumber);
    if (pageNumber <= 1) {
      this.getPage.emit(1);
    } else if (pageNumber > this.pagination.numberOfPages) {
      this.getPage.emit(this.pagination.numberOfPages);
    } else {
      this.getPage.emit(pageNumber);
    } 
  }
  
}
