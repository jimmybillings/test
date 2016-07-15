import { Component, OnInit, OnDestroy } from '@angular/core';
import { WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
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
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.collectionStoreSubscription =
      this.collectionsService.collections.subscribe(collections => this.collections = collections);
    this.focusedCollectionStoreSubscription =
      this.collectionsService.focusedCollection.subscribe(focusedCollection => this.focusedCollection = focusedCollection);
  }

  ngOnDestroy() {
    this.collectionStoreSubscription.unsubscribe();
    this.focusedCollectionStoreSubscription.unsubscribe();
  }

  public date(date: any): Date {
    return new Date(date);
  }

  public selectFocusedCollection(collection: Collection): void {
    this.collectionsService.setFocusedCollection(collection.id).first().subscribe((collection) => {
      this.collectionsService.updateFocusedCollection(collection);
      if (collection.assets) this.updateFocusedCollectionAssets(collection);
    });
  }

  public isFocusedCollection(collection: Collection): boolean {
    let isFocused: boolean;
    this.collectionsService.focusedCollection.take(1).subscribe(f => isFocused = collection.id === f.id);
    return isFocused;
  }

  public deleteCollection(collection: Collection): void {
    this.collectionsService.deleteCollection(collection.id).first().subscribe(payload => {
      let collectionLength: number;
      this.collectionsService.deleteCollectionFromStore(collection);
      this.collectionsService.collections.take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current focused, we need to get the new focused from the server.
      if (this.isFocusedCollection(collection) && collectionLength > 0) this.getFocusedCollection();
      // if we delete the last collection, reset the store to initial values (no focused collection)
      if (collectionLength === 0) this.collectionsService.destroyCollections();
    });
  }

  private getFocusedCollection(): void {
    this.collectionsService.getFocusedCollection().first().subscribe(collection => {
      this.collectionsService.updateFocusedCollection(collection);
      this.updateFocusedCollectionAssets(collection);
    });
  }

  private updateFocusedCollectionAssets(collection: any) {
    this.collectionsService.getCollectionItems(collection.id, 200).first().subscribe(assets => {
      this.collectionsService.updateFocusedCollectionAssets(assets);
    });
  }
}
