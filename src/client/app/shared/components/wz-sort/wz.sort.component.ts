import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-sort-component',
  templateUrl: 'wz.sort.html'
})

export class WzSortComponent {
  @Input() items: Array<any>;
  @Output() sort = new EventEmitter();

  public applySort(sortDefinitionId: number): void {
    this.sort.emit(sortDefinitionId);
  }
}
