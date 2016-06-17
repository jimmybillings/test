import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Collection } from '../shared/interfaces/collection.interface';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list',
  templateUrl: 'collection-list.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListComponent {
  @Input() collections: Collection[];
  @Input() focusedCollection: Collection;
  @Output() selected = new EventEmitter();
  @Output() isFocused = new EventEmitter();
  @Output() deleted = new EventEmitter();

  @Output() showSearch = new EventEmitter();
  @Output() showFilter = new EventEmitter();
  @Output() showSort = new EventEmitter();
}
