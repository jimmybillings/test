import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'two-level-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'two-level-view.html'
})
export class TwoLevelViewComponent {
  @Input() public data: any;
  @Output() public navigate: EventEmitter<Object> = new EventEmitter<Object>();

  public onClick(datum: any, child: any) {
    this.navigate.emit({
      params: `${datum.id}:${datum.name},${child.id}:${child.name}`,
      method: child.hasChildren ? 'nextLevel' : 'search'
    });
  }
}
