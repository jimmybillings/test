import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { NgFor } from 'angular2/common';
import { ValuesPipe } from '../../common/pipes/values.pipe';

@Component({
  selector: 'wz-list',
  templateUrl: 'components/wz-list/wz.list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor],
  pipes: [ValuesPipe]
})

export class WzList {
  @Input() items;
  @Input() headers;
  @Output() sort = new EventEmitter();
  private _toggleSort;
  
  constructor () {
    this._toggleSort = 0;
  }
  
  public sortBy(attribute: string): void {
    if (this._toggleSort % 2) {
      this.sort.emit({'attr': attribute, 'toggle': false}); 
    } else {
      this.sort.emit({'attr': attribute, 'toggle': true});
    }
    this._toggleSort++;
  }
}
