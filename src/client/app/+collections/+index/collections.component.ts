import { Component, OnInit, OnDestroy } from '@angular/core';
import { WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'collections',
  templateUrl: 'collections.html',
  providers: [CollectionsService],
  directives: [
    ROUTER_DIRECTIVES,
    WzPaginationComponent
  ]
})

export class CollectionsComponent implements OnInit, OnDestroy {

  public collections: any;
  public focusedCollection: any;
  public errorMessage: string;
  public config: Object;
  private collectionStoreSubscription: Subscription;
  private focusedCollectionStoreSubscription: Subscription;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.collectionStoreSubscription = this.store.select('collections').subscribe(collections => {
      this.collections = collections;
    });
    this.focusedCollectionStoreSubscription = this.store.select('focusedCollection').subscribe(focusedCollection => {
      this.focusedCollection = focusedCollection;
    });
  }

  ngOnDestroy() {
    this.collectionStoreSubscription.unsubscribe();
    this.focusedCollectionStoreSubscription.unsubscribe();
  }

  public date(date: any): Date {
    return new Date(date);
  }

  public selectFocusedCollection(collection: Collection): void {
    this.collectionsService.setFocusedCollection(collection.id).first().subscribe(payload => {
      if (collection.assets) {
        this.collectionsService.getCollectionItems(collection.id, 100).first().subscribe(search => {
          this.collectionsService.updateFocusedCollectionAssets(collection, search);
        });
      } else {
        this.collectionsService.updateFocusedCollection(collection);
      }
    });
  }

  public getFocusedCollection(): void {
    setTimeout(() => {
      this.collectionsService.getFocusedCollection().first().subscribe(payload => {
        console.log(payload);
        this.collectionsService.updateFocusedCollection(payload);
      });
    }, 1200);
  }

  public isFocusedCollection(collection: Collection): boolean {
    if (collection.id === this.store.getState().focusedCollection.id)
      return true;
    return false;
  }

  public showCollection(collection: Collection): void {
    this.router.navigate(['/collection', collection.id]);
  }

  public deleteCollection(collection: Collection): void {
    this.collectionsService.deleteCollection(collection.id).first().subscribe(payload => {
      this.collectionsService.deleteCollectionFromStore(collection);
    });
    // if we are deleting current focused, we need to get the new focused from the server.
    if (collection.id === this.store.getState().focusedCollection.id &&
      this.store.getState().collections.items.length > 1) {
      this.getFocusedCollection();
    }
    // if we delete the last collection, reset the store to initial values (no focused collection)
    if (this.store.getState().collections.items.length === 1) {
      this.collectionsService.destroyCollections();
    }
  }
}
