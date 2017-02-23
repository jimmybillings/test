import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'one-level-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'one-level-view.html'
})
export class OneLevelViewComponent {
  @Input() public data: any;
  @Output() public navigate: EventEmitter<Object> = new EventEmitter<Object>();

  public onClick(result: any) {
    this.navigate.emit({
      pathSegment: { ids: [result.id], names: [result.name] },
      method: result.hasChildren ? 'nextLevel' : 'search'
    });
  }
}
