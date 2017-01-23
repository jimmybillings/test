import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../shared/services/asset.service';
import { WzNotificationService } from '../../shared/components/wz-notification/wz.notification.service';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CartService } from '../../shared/services/cart.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CollectionLinkComponent } from '../components/collection-link.component';
import { CollectionFormComponent } from '../../application/collection-tray/components/collection-form.component';
import { CollectionDeleteComponent } from '../components/collection-delete.component';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
})


export class CollectionShowComponent implements OnInit, OnDestroy {
  public focusedCollection: Collection;
  public collection: Collection;
  public assets: any;
  public routeParams: any;
  public errorMessage: string;
  public config: Object;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    public userCan: Capabilities,
    public router: Router,
    public collections: CollectionsService,
    public asset: AssetService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public uiState: UiState,
    public notification: WzNotificationService,
    public uiConfig: UiConfig,
    public cart: CartService,
    public userPreference: UserPreferenceService,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private dialog: MdDialog) { }

  ngOnInit() {
    this.activeCollectionSubscription = this.activeCollection.data.subscribe(collection => {
      this.collection = collection;
    });
    this.routeSubscription = this.route.params.subscribe(params => this.buildRouteParams(params));
  }

  ngOnDestroy() {
    this.activeCollectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  public resetCollection() {
    this.collection = Object.assign({}, this.collection);
  }

  public buildRouteParams(params: any): void {
    this.routeParams = Object.assign({}, this.routeParams, params);
    delete (this.routeParams['id']);
  }

  public removeFromCollection(params: any): void {
    this.userPreference.openCollectionTray();
    this.activeCollection.removeAsset(params).subscribe();
  }

  public changePage(i: any): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/collection/' + this.collection.id, this.routeParams]);
  }

  public downloadComp(params: any): void {
    this.asset.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location.href = res.url;
      } else {
        this.notification.create('COMPS.NO_COMP');
      }
    });
  }

  public setCollectionForDelete(): void {
    let dialogRef: MdDialogRef<any> = this.dialog.open(CollectionDeleteComponent, { position: { top: '14%' } });
    dialogRef.componentInstance.collection = JSON.parse(JSON.stringify(this.collection));
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.afterClosed()
      .filter((collectionId) => collectionId)
      .subscribe((collectionId) => this.deleteCollection(collectionId));
  }

  public deleteCollection(id: number) {
    this.router.navigate(['/collections']).then(() => {
      this.collections.delete(id).subscribe(response => {
        this.showSnackBar({ key: 'Your collection has been deleted' });
      });
    });
  }

  public addAssetToCart(asset: any): void {
    this.cart.addAssetToProjectInCart(asset);
  }

  public getAssetsForLink(): void {
    let dialogRef: MdDialogRef<any> = this.dialog.open(CollectionLinkComponent);
    dialogRef.componentInstance.assets = this.collection.assets.items;
  }

  public editCollection() {
    this.uiConfig.get('collection').take(1).subscribe((config: any) => {
      let dialogRef: MdDialogRef<any> = this.dialog.open(CollectionFormComponent);
      dialogRef.componentInstance.collection = JSON.parse(JSON.stringify(this.collection));
      dialogRef.componentInstance.fields = config.config;
      dialogRef.componentInstance.dialog = dialogRef;
      dialogRef.componentInstance.isEdit = true;
    });
  }
}
