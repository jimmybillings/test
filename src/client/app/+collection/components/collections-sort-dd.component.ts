import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
/**
 * Directive that renders a list of collections
 */

@Component({
  moduleId: module.id,
  selector: 'collections-sort-dd',
  templateUrl: 'collections-sort-dd.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionSortDdComponent {
  @Input() UiState: any;
  public sortOptions: Array<any> = [];

  constructor() {
    this.sortOptions = [
      { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest' },
      { 'id': 1, 'label': 'DATE_MOD_OLDEST', 'value': 'modOldest' },
      { 'id': 2, 'label': 'DATE_CREATE_NEWEST', 'value': 'createNewest' },
      { 'id': 3, 'label': 'DATE_CREATE_OLDEST', 'value': 'createOldest' },
      { 'id': 4, 'label': 'LIST_COLL_ASC', 'value': 'alphaAsc' },
      { 'id': 5, 'label': 'LIST_COLL_DESC', 'value': 'alphaDesc' }
    ];
  }

  public closeCollectionsSortDd(): void {
    this.UiState.closeCollectionsSortDd();
  }
}
