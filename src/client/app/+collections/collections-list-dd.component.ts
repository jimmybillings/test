import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { Collection } from '../shared/interfaces/collection.interface';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {
  @Input() collections: Collection[];
  @Input() focusedCollection: Collection;
  @Output() selected = new EventEmitter();
  @Output() isFocused = new EventEmitter();
  // @Output() deleted = new EventEmitter();

  @Output() showSearch = new EventEmitter();
  @Output() showFilter = new EventEmitter();
  @Output() showSort = new EventEmitter();
  @Output() closeCollectionsList = new EventEmitter();
}
