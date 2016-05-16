import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { NgFor } from 'angular2/common';

@Component({
  selector: 'wz-list',
  templateUrl: 'components/wz-list/wz.list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor, MATERIAL_DIRECTIVES],
})

/**
 * WzList component takes three inputs: The collection of items as an array, a string that represents
 * a toggle, either true or false, and the headers from the UI config to build the table. It outputs a
 * sortBy event that includes the attribute to sort by, and the opposite of the toggle flag that was
 * passed in
 */
export class WzList {
  @Input() items;
  @Input() headers;
  @Input() toggleFlag;
  @Output() sort = new EventEmitter();

  public sortBy(attribute: string): void {
    this.sort.emit({'s': attribute, 'd': !this.toggleFlag});
  }

  public showRecord(record: any): void {
    console.dir(record);
  }
}
