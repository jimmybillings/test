import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import { Collection } from '../shared/interfaces/collection.interface';
import { CollectionsService} from './services/collections.service';
import { Observable} from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {

  @Input() focusedCollection: Collection;
  @Input() UiState: any;
  @Output() isFocused = new EventEmitter();
  @Output() showSearch = new EventEmitter();
  @Output() showFilter = new EventEmitter();
  @Output() showSort = new EventEmitter();
  public collections: Observable<Collection[]>;

  constructor(public collectionsService: CollectionsService) {
    this.collections = this.collectionsService.collections;
  }

  public closeCollectionsList() {
    this.UiState.closeCollectionsList();
  }

  public showNewCollection(): void {
    this.UiState.closeCollectionsList();
    this.UiState.showNewCollection();
  }

  public selected(collection: Collection) {
    this.collectionsService.setFocusedCollection(collection.id).subscribe(payload => {
      this.collectionsService.updateFocusedCollection(collection);
    });
    this.UiState.closeCollectionsList();
  }

}
