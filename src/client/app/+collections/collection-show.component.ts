import { Component, OnInit } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Rx';
import { AssetListComponent }  from '../shared/components/asset-list/asset-list.component';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { CurrentUser } from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { UiConfig } from '../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
  providers: [CollectionsService],
  directives: [
    AssetListComponent,
    PaginationComponent,
    ROUTER_DIRECTIVES
  ],
  pipes: [TranslatePipe]
})

export class CollectionShowComponent implements OnInit {
  public collections: Observable<Collections>;
  public focusedCollection: any;
  public collection: any;
  public assets: any;
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
    this.collections = this.collectionsService.collections;
    this.store.select('focusedCollection').subscribe(focusedCollection => {
      this.focusedCollection = focusedCollection;
      this.collection = this.focusedCollection;
      this.assets = this.collection.assets;
    });
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
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
}
