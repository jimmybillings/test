import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService} from '../services/collections.service';
import { ActiveCollectionService} from '../services/active-collection.service';
import { CollectionFormComponent } from '../../+collection/components/collection-form.component';
import { WzDialogComponent } from '../../shared/components/wz-dialog/wz.dialog.component';
import { CollectionFilterDdComponent } from './collections-filter-dd.component';
import { CollectionSortDdComponent } from './collections-sort-dd.component';
import { CollectionsSearchFormComponent } from './collections-search-form.component';
import { WzDropdownComponent } from '../../shared/components/wz-dropdown/wz.dropdown.component';
import { Observable} from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  directives: [
    ROUTER_DIRECTIVES,
    CollectionFormComponent,
    WzDialogComponent,
    WzDropdownComponent,
    CollectionFilterDdComponent,
    CollectionsSearchFormComponent,
    CollectionSortDdComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {
  @Input() focusedCollection: Collection;
  @Input() UiState: any;
  @Input() config: any;
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
    public activeCollection: ActiveCollectionService,
    public route: ActivatedRoute) {
    this.currentFilter = 'ALL';
    this.currentSort = 'DATE_MOD_NEWEST';
    this.currentSearchQuery = '';
    this.collections = this.collectionsService.data;
  }

  public closeCollectionsList(): void {
    this.UiState.closeCollectionsList();
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
        this.activeCollection.getItems(collection.id, 300).take(1).subscribe();
      });
      this.closeCollectionsList();
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
  }

  public applySort(sort: any) {
    this.currentSort = sort.label;
    this.collectionsService.loadCollections(sort.sort).take(1).subscribe();
  }

  public search(query: any) {
    this.collectionsService.loadCollections(query).take(1).subscribe();
    this.currentSearchQuery = query.q;
  }

  public showCollectionFilter(event: Event) {
    this.collectionFilterIsShowing = !this.collectionFilterIsShowing;
  }

  public showCollectionSort(event: Event) {
    this.collectionSortIsShowing = !this.collectionSortIsShowing;
  }

  public showCollectionSearch(event: Event) {
    this.collectionSearchIsShowing = !this.collectionSearchIsShowing;
  }

  public onCollectionShowPage(): boolean {
    return (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined);
  }
}
