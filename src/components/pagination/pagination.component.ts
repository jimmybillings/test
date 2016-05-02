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
  @Input() currentPage;
  @Output() getPage = new EventEmitter();
  
  public form: Object;
  
  constructor(public fb: FormBuilder) {}
  
  ngOnInit() {
    this.form = this.fb.group({
      page: [parseInt(this.currentPage)+1 || 0, Validators.required]
    });
  }
  
  public getPageNumber(pageNumber): void {
    if (pageNumber < 0) {
      this.getPage.emit(0);
    } else if (pageNumber > this.pagination.numberOfPages - 1) {
      this.getPage.emit(this.pagination.numberOfPages - 1);
    } else {
      this.getPage.emit(pageNumber);
    } 
  }
}
