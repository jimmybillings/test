import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
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
  public filterOptions: Array<any> = [];

  constructor() {
    this.filterOptions = [
      { 'id': 0, 'label': 'ALL', 'value': 'all' },
      { 'id': 1, 'label': 'OWN', 'value': 'own' },
      { 'id': 2, 'label': 'EDIT', 'value': 'edit' },
      { 'id': 3, 'label': 'VIEW', 'value': 'view' },
      { 'id': 4, 'label': 'RESEARCH', 'value': 'research' }
    ];
  }

  public closeCollectionsFiltertDd(): void {
    this.UiState.closeCollectionsFilterDd();
  }
}
