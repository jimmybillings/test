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

export class Pagination {
  @Input() pagination;
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Output() getPage = new EventEmitter();
  
  public form: Object;
  public currentPage = Number;
  
  constructor(public fb: FormBuilder) {
    this.form = fb.group({
      page: ['' ,Validators.required]
    });
  }
  
  public getPageNumber(pageNumber): void {
    pageNumber > this.pagination.numberOfPages ? console.log('page doesnt exist') : this.getPage.emit(pageNumber);
  }
}
