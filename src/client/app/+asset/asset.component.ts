import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { WzAssetDetailComponent } from '../shared/components/wz-asset-detail/wz.asset-detail.component';
import { AssetDetailComponent } from './components/asset-detail.component';
import { AssetDataComponent } from './components/asset-data.component';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from './services/asset.service';
import { Observable} from 'rxjs/Rx';
import { Error } from '../shared/services/error.service';
import { CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { Store } from '@ngrx/store';


/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'asset',
  templateUrl: 'asset.html',
  directives: [
    // WzAssetDetailComponent
    AssetDetailComponent,
    AssetDataComponent
  ]
})

export class AssetComponent {
  public asset: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    public currentUser: CurrentUser,
    public assetService: AssetService,
    public error: Error,
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>) {
    this.asset = assetService.asset;
  }

  public addToCollection(params: any): void {
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe(() => {
      this.activeCollection.getItems(params.collection.id, 300).take(1).subscribe();
    });
  }

  public removeFromCollection(params: any): void {
    // let collection: Collection = params.collection;
    // this.collectionsService.removeAssetsFromCollection(collection.id, params.asset).take(1).subscribe(payload => {
    //   this.collectionsService.getCollectionItems(collection.id, 300).take(1).subscribe(search => {
    //     this.collectionsService.updateFocusedCollectionAssets(payload, search);
    //     this.collectionsService.updateCollectionInStore(payload, search);
    //   });
    // });
  }

  showNewCollection(assetId: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    (!this.currentUser.loggedIn()) ? this.router.navigate(['/user/login']) : newCollectionButton.click();
  }

}
