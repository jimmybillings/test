import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
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
  @Input() currentSort: any;
  @Output() sort = new EventEmitter();
  @Output() close = new EventEmitter();
  public sortOptions: Array<any> = [];

  constructor() {
    this.sortOptions = [
      { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest', 'sort': { 's': 'lastUpdated', 'd': true }},
      { 'id': 1, 'label': 'DATE_MOD_OLDEST', 'value': 'modOldest', 'sort': { 's': 'lastUpdated', 'd': false }},
      { 'id': 2, 'label': 'DATE_CREATE_NEWEST', 'value': 'createNewest', 'sort': { 's': 'createdOn', 'd': true }},
      { 'id': 3, 'label': 'DATE_CREATE_OLDEST', 'value': 'createOldest', 'sort': { 's': 'createdOn', 'd': false }},
      { 'id': 4, 'label': 'LIST_COLL_ASC', 'value': 'alphaAsc', 'sort': { 's': 'name', 'd': false }},
      { 'id': 5, 'label': 'LIST_COLL_DESC', 'value': 'alphaDesc', 'sort': { 's': 'name', 'd': true }}
    ];
  }

  public closeCollectionsSortDd(): void {
    this.UiState.closeCollectionsSortDd();
  }

  public setActiveSort(sort:any) {
    this.sort.emit(sort);
  }
}
