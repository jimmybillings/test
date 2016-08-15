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
  @Input() UiState: any;
  @Output() filter = new EventEmitter();
  public filterOptions: Array<any> = [];

  constructor() {
    this.filterOptions = [
      { 'id': 0, 'label': 'ALL', 'value': 'all', 'active': true },
      { 'id': 1, 'label': 'OWNER', 'value': 'owner', 'active': false },
      { 'id': 2, 'label': 'EDITOR', 'value': 'editor', 'active': false },
      { 'id': 3, 'label': 'VIEWER', 'value': 'viewer', 'active': false },
      { 'id': 4, 'label': 'RESEARCHER', 'value': 'researcher', 'active': false }
    ];
  }

  public closeCollectionsFiltertDd(): void {
    this.UiState.closeCollectionsFilterDd();
  }

  public setActiveFilter(filter:any) {
    this.filterOptions = this.filterOptions.map((filterOption) => {
      filter.id === filterOption.id ? filterOption.active = true : filterOption.active = false;
      return filterOption;
    });
  }
}
