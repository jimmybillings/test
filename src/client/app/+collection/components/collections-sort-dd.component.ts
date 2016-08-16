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
  @Output() sort = new EventEmitter();
  public sortOptions: Array<any> = [];

  constructor() {
    this.sortOptions = [
      { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest', 'active': true, 'sort': { 's': 'lastUpdated', 'd': false }},
      { 'id': 1, 'label': 'DATE_MOD_OLDEST', 'value': 'modOldest', 'active': false, 'sort': { 's': 'lastUpdated', 'd': true }},
      { 'id': 2, 'label': 'DATE_CREATE_NEWEST', 'value': 'createNewest', 'active': false, 'sort': { 's': 'createdOn', 'd': false }},
      { 'id': 3, 'label': 'DATE_CREATE_OLDEST', 'value': 'createOldest', 'active': false, 'sort': { 's': 'createdOn', 'd': true }},
      { 'id': 4, 'label': 'LIST_COLL_ASC', 'value': 'alphaAsc', 'active': false, 'sort': { 's': 'name', 'd': false }},
      { 'id': 5, 'label': 'LIST_COLL_DESC', 'value': 'alphaDesc', 'active': false, 'sort': { 's': 'name', 'd': true }}
    ];
  }

  public closeCollectionsSortDd(): void {
    this.UiState.closeCollectionsSortDd();
  }

  public setActiveSort(sort:any) {
    this.sortOptions = this.sortOptions.map((sortOption) => {
      sort.id === sortOption.id ? sortOption.active = true : sortOption.active = false;
      return sortOption;
    });
    this.sort.emit(sort);
  }
}
