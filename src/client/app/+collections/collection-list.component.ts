import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list',
  templateUrl: 'collection-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class CollectionListComponent {
  @Input() collections: Collection[];
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
