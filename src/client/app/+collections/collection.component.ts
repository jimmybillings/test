import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { CollectionListComponent } from './collection-list.component';
import { CollectionFormComponent } from './collection-form.component';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
import {Observable} from 'rxjs/Rx';

import { Store } from '@ngrx/store';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
// import {CurrentUserInterface} from '../shared/interfaces/current-user.interface';
import { Error } from '../shared/services/error.service';

// import {PaginationComponent} from '../shared/components/pagination/pagination.component';

@Component({
  moduleId: module.id,
  selector: 'collection',
  templateUrl: 'collection.html',
  providers: [CollectionsService],
  directives: [
    ROUTER_DIRECTIVES,
    WzFormComponent,
    CollectionListComponent,
    CollectionFormComponent
  ],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Routes([
  { path: '/new', component: CollectionFormComponent },
  { path: '/list', component: CollectionListComponent }
  // { path: '/detail/:id', component: CollectionComponent }
])

export class CollectionComponent implements OnInit {
  public collections: Observable<Collections>;
  public focusedCollection: Observable<any>;
  public errorMessage: string;

  constructor(
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error) {
  }

  ngOnInit() {
    // this.collectionsService.loadCollections();
    this.collections = this.collectionsService.collections;
    // this.collections = this.store.select('collections');
    this.focusedCollection = this.store.select('focusedCollection');
    // this.focusedCollection.subscribe(f => console.log(f));
    // this.currentUser._currentUser.subscribe(u => {
      // console.log(u);
      // this.UserHasFocusedCollection(u) ? this.collectionsService.getFocusedCollection() : console.log('you don\'t have a focused collection');
      // this.UserHasFocusedCollection(u) ? console.log('It thinks you have collections') : console.log('you don\'t have a focused collection');
    // });

    // this.collections.subscribe(c => {
    //   console.log(c);
    // });

    // console.log(this.store);
  }

  // public UserHasFocusedCollection(user: any): boolean {
  //   return (user.hasOwnProperty('focusedCollection') && user.focusedCollection !== null) ? true : false;
  // }

  selectFocusedCollection(collection: Collection) {
    // this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: collection });
    this.collectionsService.setFocusedCollection(collection);
  }

  public createCollection(collection: Collection) {
    this.collectionsService.createCollection(collection);
    this.getFocusedCollection();
  }
  public getFocusedCollection() {
    setTimeout(() => { this.collectionsService.getFocusedCollection(); },1200);
  }
  public deleteCollection(collection: Collection) {
    this.collectionsService.deleteCollection(collection);
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
