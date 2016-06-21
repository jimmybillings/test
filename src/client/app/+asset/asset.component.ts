import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { AssetDetailComponent } from '../shared/components/asset-detail/asset-detail.component';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from './services/asset.service';
import { Observable} from 'rxjs/Rx';
import { Error } from '../shared/services/error.service';
import { Collection, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collections/services/collections.service';
import { Store } from '@ngrx/store';


/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'asset',
  templateUrl: 'asset.html',
  directives: [AssetDetailComponent]
})

export class AssetComponent implements OnInit, OnDestroy {
  public focusedCollection: Observable<any>;
  public assetDetail: Observable<any>;
  public assetDetailDisplay: Object;
  public subscription: any;

  constructor(
    private routeSegment: RouteSegment,
    public currentUser: CurrentUser,
    public assetService: AssetService,
    public error: Error,
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>) {
    this.assetDetail = assetService.asset;
  }

  ngOnInit(): void {
    this.assetService
      .initialize(this.routeSegment.getParam('name'))
      .subscribe((payload) => {
        this.assetService.set(payload);
        this.subscription = this.assetDetail.subscribe(data => this.assetDetailDisplay = data);
      },
      error => this.error.handle(error)
      );
    this.focusedCollection = this.store.select('focusedCollection');
  }

  addToCollection(params: any): void {
    let collection: Collection = params.collection;
    collection.assets ? collection.assets.push(params.assetId) : collection.assets = [params.assetId];
    this.collectionsService.addAssetsToCollection(collection.id, params.assetId).subscribe(payload => {
      this.collectionsService.updateFocusedCollection(payload);
    });
  }

  showNewCollection(assetId: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    !this.currentUser.loggedIn() ?
      this.router.navigate(['/user/login']) :
      newCollectionButton.click();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.assetService.reset();
  }
}
