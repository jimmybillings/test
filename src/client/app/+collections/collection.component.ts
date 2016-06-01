import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';

import { CollectionListComponent } from './collection-list.component';
import { CollectionFormComponent } from './collection-form.component';

import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
// import {UiConfig} from '../shared/services/ui.config';
import {Observable} from 'rxjs/Rx';
import {CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
// import {PaginationComponent} from '../shared/components/pagination/pagination.component';

@Component({
  moduleId: module.id,
  selector: 'collection',
  templateUrl: 'collection.html',
  providers: [CollectionsService],
  directives: [
    WzFormComponent,
    CollectionListComponent,
    CollectionFormComponent
  ],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent implements OnInit {

  // public config: Object;
  public collections: Observable<Array<Collection>>;
  public focusedCollection: Observable<Collection>;
  public errorMessage: string;

  constructor(
    public collectionsService: CollectionsService,
    // public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public error: Error) {
  }

  ngOnInit() {
    this.collections = this.collectionsService.collections;
    this.focusedCollection = this.collectionsService.focusedCollection;

    // this.collectionsService.loadCollections();
    // this.collectionsService.getFocusedCollection;
    this.focusedCollection.subscribe(v => console.log(v));
    // console.log(this.focusedCollection);
  }

  createCollection(collection: Collection) {
    this.collectionsService.createCollection(collection);
  }
}
