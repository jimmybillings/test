import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup} from '@angular/common';


@Component({
  moduleId: module.id,
  selector: 'pagination',
  templateUrl: 'pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    FORM_DIRECTIVES
  ]
})

/**
 * The Pagination component takes an input of the Pagination Object that is returned with
 * all API calls. It ouputs a getPage event with the pageNumber for the API to get.
 */
export class PaginationComponent implements OnInit {
  @Input() pagination: any;
  @Input() currentPage: any;
  @Output() getPage = new EventEmitter();

  public form: ControlGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      page: [this.currentPage, Validators.required]
    });
  }

  public getPageNumber(pageNumber: any): void {
    pageNumber = parseInt(pageNumber) || 1;
    if (pageNumber <= 1) {
      this.getPage.emit(1);
    } else if (pageNumber > this.pagination.numberOfPages) {
      this.getPage.emit(this.pagination.numberOfPages);
    } else {
      this.getPage.emit(pageNumber);
    }
  }
  public getCurrentPage() : Number {
    if(this.pagination.numberOfPages > 0) {
      return this.pagination.currentPage;
    }
    return 0;
  }

}
