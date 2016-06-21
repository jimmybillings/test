import { Component, OnInit } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { CollectionListComponent } from './collection-list.component';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
import { Observable} from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Routes, ROUTER_DIRECTIVES} from '@angular/router';
import { CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { UiConfig} from '../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collection',
  templateUrl: 'collection.html',
  providers: [CollectionsService],
  directives: [
    ROUTER_DIRECTIVES,
    WzFormComponent,
    CollectionListComponent
  ],
  pipes: [TranslatePipe]
})

@Routes([
  { path: ':id', component: CollectionComponent }
])

export class CollectionComponent implements OnInit {
  public collections: Observable<Collections>;
  public focusedCollection: Observable<any>;
  public errorMessage: string;
  public config: Object;

  constructor(
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.collectionsService.loadCollections().subscribe(
      payload => this.collectionsService.storeCollections(payload),
      error => this.error.handle(error)
    );
    this.collections = this.collectionsService.collections;
    this.focusedCollection = this.store.select('focusedCollection');
  }

  public selectFocusedCollection(collection: Collection): void {
    this.collectionsService.setFocusedCollection(collection.id).subscribe(payload => {
      this.collectionsService.updateFocusedCollection(collection);
    });;
  }

  public getFocusedCollection(): void {
    setTimeout(() => { this.collectionsService.getFocusedCollection().subscribe(payload => {
      this.collectionsService.updateFocusedCollection(payload);
    }); }, 1200);
  }

  public isFocusedCollection(collection: Collection): boolean {
    if (collection.id === this.store.getState().focusedCollection.id)
      return true;
    return false;
  }

  public deleteCollection(collection: Collection): void {
    this.collectionsService.deleteCollection(collection.id).subscribe(payload => {
      this.collectionsService.deleteCollectionFromStore(payload);
    });
    // if we are deleting current focused, we need to get the new focused from the server.
    if (collection.id === this.store.getState().focusedCollection.id &&
      this.store.getState().collections.items.length > 0) {
      this.getFocusedCollection();
    }
    // if we delete the last collection, reset the store to initial values (no focused collection)
    if (this.store.getState().collections.items.length === 0) {
      this.collectionsService.clearCollections();
    }
  }

  public showCollectionSearch(event: Event): void {
    console.log(event);
  }

  public showCollectionFilter(event: Event): void {
    console.log(event);
  }

  public showCollectionSort(event: Event): void {
    console.log(event);
  }
}
