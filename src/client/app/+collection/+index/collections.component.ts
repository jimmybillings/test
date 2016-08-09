import { Component, OnInit, OnDestroy } from '@angular/core';
import { WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import { Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';
import { WzDropdownComponent } from '../../shared/components/wz-dropdown/wz.dropdown.component';
import { CollectionSortDdComponent } from '../../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../../+collection/components/collections-filter-dd.component';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'collections',
  templateUrl: 'collections.html',
  providers: [CollectionsService],
  directives: [
    ROUTER_DIRECTIVES,
    WzPaginationComponent,
    WzDropdownComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent
  ]
})

export class CollectionsComponent implements OnInit, OnDestroy {
  public collections: Collections;
  public errorMessage: string;
  private collectionStoreSubscription: Subscription;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.collectionsService.loadCollections('all',400).take(1).subscribe();
    this.collectionStoreSubscription =
      this.collectionsService.data.subscribe(collections => this.collections = collections);
  }

  ngOnDestroy() {
    this.collectionStoreSubscription.unsubscribe();
  }

  public date(date: any): Date {
    return new Date(date);
  }

  public selectActiveCollection(id: number): void {
    this.activeCollection.set(id).take(1).subscribe(() => {
      this.activeCollection.getItems(id, 300).take(1).subscribe();
    });
  }

  public isActiveCollection(collectionId: number): boolean {
    let isMatch: boolean;
    this.activeCollection.data.take(1)
      .map(activeCollection => activeCollection.id)
      .subscribe(id => isMatch = id === collectionId);
    return isMatch;
  }

  public thumbnail(thumbnail: {urls: {https: string}}): string {
    return (thumbnail) ? thumbnail.urls.https : '/assets/img/tbn_missing.jpg';
  }

  public deleteCollection(id: number): void {
    this.collectionsService.deleteCollection(id).take(1).subscribe(payload => {
      let collectionLength: number;
      this.collectionsService.data.take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current active, we need to get the new active from the server.
      if (this.isActiveCollection(id) && collectionLength > 0) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, 200).take(1).subscribe();
        });
      }
      // if we delete the last collection, reset the store to initial values (no active collection)
      if (collectionLength === 0) {
        this.collectionsService.destroyCollections();
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, 200).take(1).subscribe();
          this.collectionsService.loadCollections('all',400).take(1).subscribe();
        });
      }
    });
  }
}
