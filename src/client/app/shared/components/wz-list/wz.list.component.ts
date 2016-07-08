import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'wz-list',
  templateUrl: 'wz.list.html',
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * WzList component takes three inputs: The collection of items as an array, a string that represents
 * a toggle, either true or false, and the headers from the UI config to build the table. It outputs a
 * sortBy event that includes the attribute to sort by, and the opposite of the toggle flag that was
 * passed in
 */
export class WzListComponent {
  public map: any;
  @Input() items: any;
  @Input() headers: any;
  @Input() toggleFlag: any;
  @Output() sort = new EventEmitter();
  @Output() editForm = new EventEmitter();

  constructor() {
    this.map = {
      'false': 'true',
      'true': 'false'
    };
  }

  public sortBy(attribute: string): void {
    this.sort.emit({ 's': attribute, 'd': this.map[this.toggleFlag] });
  }

  public showEditForm(record: any): void {
    this.editForm.emit(record);
  }

  public date(date: any): Date {
    return new Date(date);
  }
}
