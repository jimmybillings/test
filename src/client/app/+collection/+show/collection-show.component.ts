import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute} from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../+asset/services/asset.service';
import { UserPermission } from '../../shared/services/permission.service';
import { WzNotificationService } from '../../shared/components/wz-notification/wz.notification.service';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
})

export class CollectionShowComponent implements OnInit, OnDestroy {
  public collections: Observable<Collections>;
  public focusedCollection: Collection;
  public collection: Collection;
  public assets: any;
  public routeParams: any;
  public errorMessage: string;
  public config: Object;
  @ViewChild('target', { read: ViewContainerRef }) private target: any;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;
  public date(date: any): Date {
    if (date) {
      return new Date(date);
    } else {
      return new Date();
    };
  }

  constructor(
    private route: ActivatedRoute,
    public permission: UserPermission,
    public router: Router,
    public collectionsService: CollectionsService,
    public assetService: AssetService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiState: UiState,
    public notification: WzNotificationService,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.activeCollectionSubscription = this.activeCollection.data.subscribe(collection => {
      this.collection = collection;
    });
    this.routeSubscription = this.route.params.subscribe(params => this.buildRouteParams(params));
  }

  public buildRouteParams(params: any): void {
    this.routeParams = Object.assign({}, this.routeParams, params);
    delete(this.routeParams['id']);
  }

  ngOnDestroy() {
    this.activeCollectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public removeFromCollection(params: any): void {
    let collection: any = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => parseInt(item.assetId) === parseInt(params.asset.assetId)).uuid;
    if(uuid && params.asset.assetId) this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid).take(1).subscribe();
  }

  public changePage(i: any): void {
    this.buildRouteParams({i});
    this.router.navigate(['/collection/' + this.collection.id, this.routeParams ]);
  }

  public downloadComp(params: any): void {
    this.assetService.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        console.log(res);
        window.location.href = res.url;
      } else {
        this.notification.createNotfication(this.target, {trString: 'COMPS.NO_COMP', theme: 'alert'});
      }
    });
  }
}
