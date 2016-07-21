import { Component, OnInit, OnDestroy } from '@angular/core';
import { WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
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

  public collections: Collections;
  public activeCollectionStore: Collection;
  public errorMessage: string;
  public config: Object;
  private collectionStoreSubscription: Subscription;
  private activeCollectionStoreSubscription: Subscription;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.collectionsService.loadCollections().take(1).subscribe();
    this.collectionStoreSubscription =
      this.collectionsService.collections.subscribe(collections => this.collections = collections);
    this.activeCollectionStoreSubscription =
      this.activeCollection.data.subscribe(activeCollection => this.activeCollectionStore = activeCollection);
  }

  ngOnDestroy() {
    this.collectionStoreSubscription.unsubscribe();
    this.activeCollectionStoreSubscription.unsubscribe();
  }

  public date(date: any): Date {
    return new Date(date);
  }

  public selectActiveCollection(collection: Collection): void {
    this.activeCollection.set(collection.id).take(1).subscribe(() => {
      this.activeCollection.getItems(collection.id, 300).take(1).subscribe();
    });
  }

  public isActiveCollection(collection: Collection): boolean {
    return this.activeCollectionStore.id === collection.id;
  }

  public thumbnail(collection: Collection): string {
    return (collection.collectionThumbnail) ? collection.collectionThumbnail.urls.https : '/assets/img/tbn_missing.jpg';
  }

  public deleteCollection(collection: Collection): void {
    this.collectionsService.deleteCollection(collection.id).take(1).subscribe(payload => {
      let collectionLength: number;
      this.collectionsService.collections.take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current active, we need to get the new active from the server.
      if (this.isActiveCollection(collection) && collectionLength > 0) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, 200).take(1).subscribe();
        });
      }
      // if we delete the last collection, reset the store to initial values (no active collection)
      if (collectionLength === 0) {
        this.collectionsService.destroyCollections();
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, 200).take(1).subscribe();
          this.collectionsService.loadCollections().take(1).subscribe();
        });
      }
    });
  }

  public getUserRole(collection: Collection): string {
    let role: string = 'Viewer';
    this.currentUser.get('id').take(1).subscribe((id) => {
      if (id === collection.owner) {
        role = 'Owner';
      } else {
        if (collection.editors && collection.editors.indexOf(id) > -1) {
          role = 'Editor';
        }
      };
    });
    return role;
  }
}
