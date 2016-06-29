import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router} from '@angular/router';
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
  // @Output() isFocused = new EventEmitter();
  // @Output() showSearch = new EventEmitter();
  // @Output() showFilter = new EventEmitter();
  // @Output() showSort = new EventEmitter();
  public collections: Observable<Collection[]>;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService) {
      this.collections = this.collectionsService.collections;
  }

  public closeCollectionsList(): void {
    this.UiState.closeCollectionsList();
  }

  public showNewCollection(): void {
    this.UiState.closeCollectionsList();
    this.UiState.showNewCollection();
  }

  public selectFocusedCollection(collection: Collection) {
    this.collectionsService.setFocusedCollection(collection.id).subscribe(payload => {
      if (collection.assets) {
        this.collectionsService.getCollectionItems(collection.id,200).subscribe(search => {
          this.collectionsService.updateFocusedCollectionAssets(collection, search);
        });
      }else {
        this.collectionsService.updateFocusedCollection(collection);
      }
    });
    this.UiState.closeCollectionsList();
  }

  public navigateToCollectionShow(assetId: number): void {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection/', assetId]);
  }

  public navigateToCollectionsIndex(): void {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection']);
  }

  public showCollectionSearch(event: Event): void {
    console.log(event);
  }

  public showCollectionFilter(event: Event): void {
    console.log(event);
  }

  public showCollectionSort(event: Event): void {
    console.log(event);
  }

}
