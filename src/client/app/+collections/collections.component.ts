import { Component, OnInit } from '@angular/core';
import { Collection, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
// import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { CurrentUser } from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { UiConfig } from '../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collections',
  templateUrl: 'collections.html',
  providers: [CollectionsService],
  directives: [
    ROUTER_DIRECTIVES,
    PaginationComponent
  ],
  pipes: [TranslatePipe]
})

export class CollectionsComponent implements OnInit {
  // public collections: Observable<Collections>;
  public collections: any;
  public focusedCollection: any;
  public errorMessage: string;
  public config: Object;
  public date(date: any): Date {
    return new Date(date);
  }
  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    // this.collections = this.collectionsService.collections;
    this.store.select('collections').subscribe(collections => {
      this.collections = collections;
    });
    this.store.select('focusedCollection').subscribe(focusedCollection => {
      this.focusedCollection = focusedCollection;
    });
  }

  public selectFocusedCollection(collection: Collection): void {
    this.collectionsService.setFocusedCollection(collection.id).subscribe(payload => {
      if (collection.assets) {
        this.collectionsService.getCollectionItems(collection.id, 100).subscribe(search => {
          this.collectionsService.updateFocusedCollectionAssets(collection, search);
        });
      } else {
        this.collectionsService.updateFocusedCollection(collection);
      }
    });
  }

  public getFocusedCollection(): void {
    setTimeout(() => {
      this.collectionsService.getFocusedCollection().subscribe(payload => {
        this.collectionsService.updateFocusedCollection(payload);
      });
    }, 1200);
  }

  public isFocusedCollection(collection: Collection): boolean {
    if (collection.id === this.store.getState().focusedCollection.id)
      return true;
    return false;
  }

  public deleteCollection(collection: Collection): void {
    this.collectionsService.deleteCollection(collection.id).subscribe(payload => {
      this.collectionsService.deleteCollectionFromStore(collection);
    });
    // if we are deleting current focused, we need to get the new focused from the server.
    if (collection.id === this.store.getState().focusedCollection.id &&
      this.store.getState().collections.items.length > 1) {
      this.getFocusedCollection();
    }
    // if we delete the last collection, reset the store to initial values (no focused collection)
    if (this.store.getState().collections.items.length === 1) {
      this.collectionsService.clearCollections();
    }
  }

}
