import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'wz-list',
  templateUrl: 'components/wz-list/wz.list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor]
})

export class WzList {
  @Input() items;
}
