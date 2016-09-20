import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
/**
 * Directive that renders a list of collections
 */

@Component({
  moduleId: module.id,
  selector: 'collections-filter-dd',
  templateUrl: 'collections-filter-dd.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionFilterDdComponent {
  @Input() currentFilter: any;
  @Output() filter = new EventEmitter();
  @Output() close = new EventEmitter();
  public filterOptions: Array<any> = [];

  constructor() {
    this.filterOptions = [
      { 'id': 0, 'label': 'ALL', 'value': 'all', 'access': {'accessLevel': 'all'} },
      { 'id': 1, 'label': 'OWNER', 'value': 'owner', 'access': {'accessLevel': 'owner'} },
      { 'id': 2, 'label': 'EDITOR', 'value': 'editor', 'access': {'accessLevel': 'editor'} },
      { 'id': 3, 'label': 'VIEWER', 'value': 'viewer', 'access': {'accessLevel': 'viewer'} },
      { 'id': 4, 'label': 'RESEARCHER', 'value': 'researcher', 'access': {'accessLevel': 'researcher'} }
    ];
  }

  public closeCollectionsFiltertDd(): void {
    this.close.emit();
  }

  public setActiveFilter(filter:any) {
    this.filter.emit(filter);
  }
}
