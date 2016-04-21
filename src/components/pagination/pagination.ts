import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';

@Component({
  selector: 'pagination',
  templateUrl: 'components/pagination/pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Pagination {
  @Input() paginationObject;  
}
