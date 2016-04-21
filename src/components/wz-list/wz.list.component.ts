import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgFor } from 'angular2/common';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'wz-list',
  templateUrl: 'components/wz-list/wz.list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor, MATERIAL_DIRECTIVES, Pagination]
})

export class WzList {
  @Input() items;
}
