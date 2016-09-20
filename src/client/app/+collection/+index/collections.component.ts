import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collections, Collection } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { Subscription } from 'rxjs/Rx';
import { CollectionContextService } from '../../shared/services/collection-context.service';
import { UiState } from '../../shared/services/ui.state';

@Component({
  moduleId: module.id,
  selector: 'collections-component',
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
  public filterOptions: Array<any> = [];
  public sortOptions: Array<any> = [];
  public collectionForDelete: Collection;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public collectionContext: CollectionContextService,
    public activeCollection: ActiveCollectionService,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public uiState: UiState) {
    this.filterOptions = [
      { 'id': 0, 'label': 'ALL', 'value': 'all', 'access': { 'accessLevel': 'all' } },
      { 'id': 1, 'label': 'OWNER', 'value': 'owner', 'access': { 'accessLevel': 'owner' } },
      { 'id': 2, 'label': 'EDITOR', 'value': 'editor', 'access': { 'accessLevel': 'editor' } },
      { 'id': 3, 'label': 'VIEWER', 'value': 'viewer', 'access': { 'accessLevel': 'viewer' } },
      { 'id': 4, 'label': 'RESEARCHER', 'value': 'researcher', 'access': { 'accessLevel': 'researcher' } }
    ];
    this.sortOptions = [
      { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest', 'sort': { 's': 'lastUpdated', 'd': true } },
      { 'id': 1, 'label': 'DATE_MOD_OLDEST', 'value': 'modOldest', 'sort': { 's': 'lastUpdated', 'd': false } },
      { 'id': 2, 'label': 'DATE_CREATE_NEWEST', 'value': 'createNewest', 'sort': { 's': 'createdOn', 'd': true } },
      { 'id': 3, 'label': 'DATE_CREATE_OLDEST', 'value': 'createOldest', 'sort': { 's': 'createdOn', 'd': false } },
      { 'id': 4, 'label': 'LIST_COLL_ASC', 'value': 'alphaAsc', 'sort': { 's': 'name', 'd': false } },
      { 'id': 5, 'label': 'LIST_COLL_DESC', 'value': 'alphaDesc', 'sort': { 's': 'name', 'd': true } }
    ];
  }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe(config => {
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

  public setCollectionForEdit(collection: any) {
    this.collectionForEdit = Object.assign({}, collection);
  }

  public selectActiveCollection(id: number): void {
    this.activeCollection.set(id).take(1).subscribe(() => {
      this.activeCollection.getItems(id, { n: this.pageSize }).take(1).subscribe();
    });
  }

  public setCollectionForDelete(collection: any): void {
    this.collectionForDelete = collection;
  }

  public deleteCollection(id: number): void {
    this.collectionsService.deleteCollection(id).take(1).subscribe(payload => {
      let collectionLength: number;
      this.collectionsService.data.take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current active, we need to get the new active from the server.
      if (this.activeCollection.isActiveCollection(id) && collectionLength > 0) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, { n: this.pageSize }).take(1).subscribe();
        });
      }
      // if we delete the last collection, reset the store to initial values (no active collection)
      if (collectionLength === 0) {
        this.collectionsService.destroyCollections();
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, { n: this.pageSize }).take(1).subscribe();
          this.collectionsService.loadCollections().take(1).subscribe();
        });
      }
    });
  }

  public search(query: any) {
    this.collectionContext.updateCollectionOptions({ currentSearchQuery: query });
    this.collectionsService.loadCollections(query).take(1).subscribe();
  }

  public filter(filter: any) {
    this.collectionContext.updateCollectionOptions({ currentFilter: filter });
    this.collectionsService.loadCollections(filter.access).take(1).subscribe();
  }

  public sortBy(sort: any) {
    this.collectionContext.updateCollectionOptions({ currentSort: sort });
    this.collectionsService.loadCollections(sort.sort).take(1).subscribe();
  }

  public isActiveCollection(collectionId: number): boolean {
    let isMatch: boolean;
    this.activeCollection.data.take(1)
      .map(activeCollection => activeCollection.id)
      .subscribe(id => isMatch = id === collectionId);
    return isMatch;
  }
}
