import { Component, OnInit, ViewChild } from '@angular/core';
import { Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';
import { CollectionSortDdComponent } from '../../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../../+collection/components/collections-filter-dd.component';

@Component({
  moduleId: module.id,
  selector: 'collections',
  templateUrl: 'collections.html',
})

export class CollectionsComponent implements OnInit {
  public collections: Collections;
  public errorMessage: string;
  public collectionSearchIsShowing: boolean = false;
  public collectionFilterIsShowing: boolean = false;
  public collectionSortIsShowing: boolean = false;
  public activeFilter: string;
  public activeSort: string;
  public pageSize: string;
  @ViewChild(CollectionFilterDdComponent) public filters: CollectionFilterDdComponent;
  @ViewChild(CollectionSortDdComponent) public sort: CollectionSortDdComponent;


  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.uiConfig.get('home').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
    this.collectionsService.setSearchParams();
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
    this.collectionsService.loadCollections(filter.access).take(1).subscribe();
  }

  public search(query: any) {
    this.collectionsService.loadCollections(query).take(1).subscribe();
  }

  public sortBy(sort: any) {
    this.collectionsService.loadCollections(sort.sort).take(1).subscribe();

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
