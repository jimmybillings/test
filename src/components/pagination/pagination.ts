import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';

@Component({
  selector: 'pagination',
  templateUrl: 'components/pagination/pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MATERIAL_DIRECTIVES]
})

export class Pagination {
  @Input() paginationObject;  
}
