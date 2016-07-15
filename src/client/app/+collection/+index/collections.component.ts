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
    this.collectionsService.setFocusedCollection(collection.id).first().subscribe(() => {
      this.updateFocusedCollectionAssets(collection);
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
      if (this.isFocusedCollection(collection) && collectionLength > 1) this.getFocusedCollection();
      if (collectionLength === 1) this.collectionsService.destroyCollections();
    });
  }

  private getFocusedCollection(): void {
    this.collectionsService.getFocusedCollection().first().subscribe(collection => {
      this.updateFocusedCollectionAssets(collection);
    });
  }

  private updateFocusedCollectionAssets(collection: any) {
    this.collectionsService.getCollectionItems(collection.id, 200).first().subscribe(assets => {
      this.collectionsService.updateFocusedCollectionAssets(collection, assets);
    });
  }
}
