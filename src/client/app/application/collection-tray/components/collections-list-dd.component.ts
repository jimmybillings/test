import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { Collection, Collections } from '../../../shared/interfaces/collection.interface';
import { CollectionsService} from '../../../+collection/services/collections.service';
import { ActiveCollectionService} from '../../../+collection/services/active-collection.service';
import { Observable} from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {
  @Input() focusedCollection: Collection;
  @Input() UiState: any;
  @Input() config: any;
  @Output() close = new EventEmitter();
  public collections: Observable<Collections>;
  public currentFilter: string;
  public currentSort: string;
  public currentSearchQuery: string;
  public collectionFilterIsShowing: boolean = false;
  public collectionSortIsShowing: boolean = false;
  public collectionSearchIsShowing: boolean = false;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService) {
    this.currentFilter = 'ALL';
    this.currentSort = 'DATE_MOD_NEWEST';
    this.currentSearchQuery = '';
    this.collections = this.collectionsService.data;
  }

  public closeCollectionsList(): void {
    this.close.emit();
  }

  public showNewCollection(): void {
    this.UiState.closeCollectionsList();
    this.UiState.showNewCollection();
  }

  public selectFocusedCollection(collection: Collection) {
    if (this.onCollectionShowPage()) {
      this.navigateToCollectionShow(collection.id);
    } else {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, 50).take(1).subscribe();
      });
    }
  }

  public navigateToCollectionShow(assetId: number): void {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection/', assetId]);
  }

  public navigateToCollectionsIndex() {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection']);
  }

  public applyFilter(filter: any) {
    this.currentFilter = filter.label;
    this.collectionsService.loadCollections(filter.access).take(1).subscribe();
    this.showCollectionFilter();
  }

  public applySort(sort: any) {
    this.currentSort = sort.label;
    this.collectionsService.loadCollections(sort.sort).take(1).subscribe();
    this.showCollectionSort();
  }

  public search(query: any) {
    this.collectionsService.loadCollections(query).take(1).subscribe();
    this.currentSearchQuery = query.q;
    // this.showCollectionSearch();
  }

  public showCollectionFilter() {
    this.collectionFilterIsShowing = !this.collectionFilterIsShowing;
  }

  public showCollectionSort() {
    this.collectionSortIsShowing = !this.collectionSortIsShowing;
  }

  public showCollectionSearch() {
    console.log(`toggle search display to ${this.collectionSearchIsShowing}`);
    this.collectionSearchIsShowing = !this.collectionSearchIsShowing;
  }

  public onCollectionShowPage(): boolean {
    return (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined);
  }
}
