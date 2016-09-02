import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Collections, Collection } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';
import { Subscription } from 'rxjs/Rx';
import { CollectionContextService } from '../../shared/services/collection-context.service';
import { CollectionSortDdComponent } from '../../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../../+collection/components/collections-filter-dd.component';
import { WzDialogComponent } from '../../shared/components/wz-dialog/wz.dialog.component';
import { UiState } from '../../shared/services/ui.state';

@Component({
  moduleId: module.id,
  selector: 'collections',
  templateUrl: 'collections.html',
})

export class CollectionsComponent implements OnInit, OnDestroy {
  public collections: Collections;
  public optionsSubscription: Subscription;
  public errorMessage: string;
  public options: any;
  public collectionSearchIsShowing: boolean = false;
  public collectionFilterIsShowing: boolean = false;
  public collectionSortIsShowing: boolean = false;
  public pageSize: string;
  public collectionForEdit: Collection;
  @ViewChild(CollectionFilterDdComponent) public filters: CollectionFilterDdComponent;
  @ViewChild(CollectionSortDdComponent) public sort: CollectionSortDdComponent;
  @ViewChild('editCollection') public dialog: WzDialogComponent;


  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public collectionContext: CollectionContextService,
    public activeCollection: ActiveCollectionService,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig,
    public uiState: UiState) {}

  ngOnInit() {
    this.uiConfig.get('home').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
    this.collectionsService.setSearchParams();
    this.optionsSubscription = this.collectionContext.data.subscribe(data => this.options = data);
  }

  ngOnDestroy(): void {
    this.optionsSubscription.unsubscribe();
  }

  public toggleCollectionSearch() {
    this.collectionSearchIsShowing = !this.collectionSearchIsShowing;
  }
  public showCollectionFilter() {
    this.collectionFilterIsShowing = !this.collectionFilterIsShowing;
  }
  public showCollectionSort() {
    this.collectionSortIsShowing = !this.collectionSortIsShowing;
  }

  public setCollectionForEdit(collection: any) {
    this.collectionForEdit = collection;
    this.dialog.show();
  }

  public selectActiveCollection(id: number): void {
    this.activeCollection.set(id).take(1).subscribe(() => {
      this.activeCollection.getItems(id, {n: this.pageSize}).take(1).subscribe();
    });
  }

  public deleteCollection(id: number): void {
    this.collectionsService.deleteCollection(id).take(1).subscribe(payload => {
      let collectionLength: number;
      this.collectionsService.data.take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current active, we need to get the new active from the server.
      if (this.isActiveCollection(id) && collectionLength > 0) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, {n: this.pageSize}).take(1).subscribe();
        });
      }
      // if we delete the last collection, reset the store to initial values (no active collection)
      if (collectionLength === 0) {
        this.collectionsService.destroyCollections();
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, {n: this.pageSize}).take(1).subscribe();
          this.collectionsService.loadCollections().take(1).subscribe();
        });
      }
    });
  }

  public filter(filter: any) {
    this.collectionContext.updateCollectionOptions({currentFilter: filter});
    this.collectionsService.loadCollections(filter.access).take(1).subscribe();
    this.showCollectionFilter();
  }

  public search(query: any) {
    this.collectionContext.updateCollectionOptions({currentSearchQuery: query});
    this.collectionsService.loadCollections(query).take(1).subscribe();
  }

  public sortBy(sort: any) {
    this.collectionContext.updateCollectionOptions({currentSort: sort});
    this.collectionsService.loadCollections(sort.sort).take(1).subscribe();
    this.showCollectionSort();
  }

  public isActiveCollection(collectionId: number): boolean {
    let isMatch: boolean;
    this.activeCollection.data.take(1)
      .map(activeCollection => activeCollection.id)
      .subscribe(id => isMatch = id === collectionId);
    return isMatch;
  }

  public getActiveFilter(): string {
    let filter = this.filters.filterOptions.filter((obj: any) => obj.active === true);
    return (filter.length > 0) ? filter[0].value : '';
  }

  public getActiveSort(): string {
    let activeSort = this.sort.sortOptions.filter(obj => obj.active === true);
    return (activeSort.length > 0) ? activeSort[0].label : '';
  }

}
