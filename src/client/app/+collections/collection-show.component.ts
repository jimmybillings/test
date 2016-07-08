import { Component, OnInit } from '@angular/core';
import { Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { Observable } from 'rxjs/Rx';
import { AssetListComponent }  from '../shared/components/asset-list/asset-list.component';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
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
  ]
})

export class CollectionShowComponent implements OnInit {
  public collections: Observable<Collections>;
  public focusedCollection: any;
  public collection: any;
  public assets: any;
  public errorMessage: string;
  public config: Object;
  public date(date: any): Date {
    if (date) {
      return new Date(date);
    } else {
      return new Date();
    };
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.collectionsService.setFocusedCollection(params['id']).subscribe(fc => {
        if (fc.assets) {
          this.collectionsService.getCollectionItems(fc.id, 100).subscribe(search => {
            this.collectionsService.updateFocusedCollectionAssets(fc, search);
          });
        } else {
          this.collectionsService.updateFocusedCollection(fc);
        }
      });

      this.store.select('focusedCollection').subscribe(focusedCollection => {
        this.focusedCollection = focusedCollection;
        this.collection = this.focusedCollection;
        this.assets = this.collection.assets;
      });

    });

  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }
}
