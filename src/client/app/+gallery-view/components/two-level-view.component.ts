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

  public onClick(result: any, child: any) {
    this.navigate.emit({
      pathSegment: { ids: [result.id, child.id], names: [result.name, child.name] },
      method: child.hasChildren ? 'nextLevel' : 'search'
    });
  }
}
