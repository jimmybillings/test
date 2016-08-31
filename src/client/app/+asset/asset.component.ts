import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from './services/asset.service';
import { Observable} from 'rxjs/Rx';
import { Error } from '../shared/services/error.service';
import { CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { Store } from '@ngrx/store';
import { UiConfig } from '../shared/services/ui.config';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'asset',
  templateUrl: 'asset.html'
})

export class AssetComponent implements OnInit {
  public asset: Observable<any>;
  public pageSize: string;

  constructor(
    private route: ActivatedRoute,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public assetService: AssetService,
    public error: Error,
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>) {
    this.asset = assetService.data;
  }

  ngOnInit(): void {
    this.uiConfig.get('home').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public addToCollection(params: any): void {
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe(() => {
      this.activeCollection.getItems(params.collection.id, {n: this.pageSize}).take(1).subscribe();
    });
  }

  public downloadComp(params: any): void {
    this.assetService.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location = res.url;
      } else {
        alert('no comp exists');
      }
    });
  }

  public removeFromCollection(params: any): void {
    let collection: any = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => parseInt(item.assetId) === parseInt(params.asset.assetId)).uuid;
    if(uuid && params.asset.assetId) {
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid).take(1).subscribe();
    }
  }

  showNewCollection(assetId: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-collection-tray');
    (!this.currentUser.loggedIn()) ? this.router.navigate(['/user/login']) : newCollectionButton.click();
  }

}
