import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Collection, CollectionStore } from '../shared/interfaces/collection.interface';
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

export class CollectionComponent implements OnInit, OnDestroy {
  public collections: Observable<Array<Collection>>;
  public focusedCollection: Observable<any>;
  public errorMessage: string;

  constructor(
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error) {
  }

  ngOnInit() {
    // this.collections = this.collectionsService.collections;
    this.focusedCollection = this.store.select('focusedCollection');
    // this.focusedCollection.subscribe(f => console.log(f));
    this.currentUser._currentUser.subscribe(u => {
      console.log(u);
      this.UserHasFocusedCollection(u) ? this.collectionsService.getFocusedCollection() : console.log('you don\'t have a focused collection');
    });
    // console.log(this.store);
  }

  ngOnDestroy(): void {
    console.log('collection component is toast');
    this.collectionsService.resetFocused();
    // this.FocusedCollection.destroy();
  }

  public UserHasFocusedCollection(user: any): boolean {
    // console.log(`user has attribute FC: ${user.hasOwnProperty('focusedCollection')}`);
    // console.log(`user FC attribute value is: ${user.hasOwnProperty('focusedCollection')}`);
    return (user.hasOwnProperty('focusedCollection') && user.focusedCollection !== null) ? true : false;
  }

  // resetFocusedCollection(): void {
  //   let emptyCollection: Collection = {
  //     createdOn: '',
  //     lastUpdated: '',
  //     id: null,
  //     siteName: '',
  //     name: '',
  //     owner: '',
  //     assets: [],
  //     tags: [],
  //   };
  //   this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: emptyCollection });
  // }

  selectFocusedCollection(collection: Collection) {
    this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: collection });
  }

  createCollection(collection: Collection) {
    this.collectionsService.createCollection(collection);
  }
}
