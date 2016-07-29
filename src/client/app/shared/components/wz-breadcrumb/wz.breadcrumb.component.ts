import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb',
  templateUrl: 'wz.breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzBreadcrumbComponent {
  @Input() filterIds: Array<any>;
  @Output() apply = new EventEmitter();
  @Output() clear = new EventEmitter();

  public applyFilter(filterId: any): void {
    this.apply.emit(filterId);
  }

  public clearFilters(): void {
    this.clear.emit(event);
  }
}
