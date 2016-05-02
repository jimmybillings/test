import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgFor } from 'angular2/common';

@Component({
  selector: 'wz-list',
  templateUrl: 'components/wz-list/wz.list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor, MATERIAL_DIRECTIVES],
})

export class WzList {
  @Input() items;
  @Input() headers;
  @Output() sort = new EventEmitter();

  public sortBy(attribute: string): void {
    this.sort.emit(attribute);
  }
}
