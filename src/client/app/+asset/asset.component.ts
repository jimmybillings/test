import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetDetailComponent } from '../shared/components/asset-detail/asset-detail.component';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from './services/asset.service';
import { Observable, Subscription} from 'rxjs/Rx';
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
  private assetDetailSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public currentUser: CurrentUser,
    public assetService: AssetService,
    public error: Error,
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>) {
    this.assetDetail = assetService.asset;
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.assetService
        .initialize(params['name'])
        .first()
        .subscribe((payload) => {
          this.assetService.set(payload);
          this.assetDetailSubscription =
            this.assetDetail.subscribe(data => this.assetDetailDisplay = data);
        },
        error => this.error.handle(error)
        );
    });
    this.focusedCollection = this.store.select('focusedCollection');
  }

  public addToCollection(params: any): void {
    let collection: Collection = params.collection;
    collection.assets ? collection.assets.items.push(params.asset) : collection.assets.items = [params.asset];

    this.collectionsService.addAssetsToCollection(collection.id, params.asset)
      .first().subscribe(payload => {
        this.collectionsService.getCollectionItems(collection.id, 300)
          .first().subscribe(search => {
            this.collectionsService.updateFocusedCollectionAssets(payload, search);
            this.collectionsService.updateCollectionInStore(payload, search);
          });
      });
  }

  showNewCollection(assetId: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    !this.currentUser.loggedIn() ?
      this.router.navigate(['/user/login']) :
      newCollectionButton.click();
  }

  ngOnDestroy(): void {
    this.assetDetailSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.assetService.reset();
  }
}
