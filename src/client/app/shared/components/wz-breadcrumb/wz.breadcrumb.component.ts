import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject, forwardRef } from '@angular/core';
import { SearchComponent } from '../../../+search/search.component';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb',
  templateUrl: 'wz.breadcrumb.html',
  directives: [WzBreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzBreadcrumbComponent {
  @Input() filters: any;
  @Output() apply = new EventEmitter();
  @Output() clear = new EventEmitter();

  constructor(@Inject(forwardRef(() => SearchComponent)) searchComponent:SearchComponent) {

  }
  public applyFilter(filterId: any): void {
    this.apply.emit(filterId);
  }
  

  public clearFilters(): void {
    this.clear.emit(event);
  }
}
