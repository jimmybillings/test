import { Component, OnInit, OnDestroy, Renderer, ViewChild, ChangeDetectionStrategy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Collection, CollectionsStoreI } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../shared/services/asset.service';
import { ErrorStore } from '../../shared/stores/error.store';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CartService } from '../../shared/services/cart.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CollectionLinkComponent } from '../components/collection-link.component';
import { CollectionFormComponent } from '../../application/collection-tray/components/collection-form.component';
import { CollectionDeleteComponent } from '../components/collection-delete.component';
import { WzSpeedviewComponent } from '../../shared/modules/wz-asset/wz-speedview/wz.speedview.component';
import { WzSubclipEditorComponent } from '../../shared/components/wz-subclip-editor/wz.subclip-editor.component';
import { WindowRef } from '../../shared/services/window-ref.service';
import { SubclipMarkers, SpeedviewData, SpeedviewEvent } from '../../shared/interfaces/asset.interface';
import { AddAssetParameters } from '../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../shared/services/quote-edit.service';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzEvent, Coords } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionShowComponent implements OnInit, OnDestroy {
  public focusedCollection: Collection;
  public collection: Collection;
  public assets: any;
  public routeParams: any;
  public errorMessage: string;
  public config: Object;
  public screenWidth: number;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;
  @ViewChild(WzSpeedviewComponent) private wzSpeedview: WzSpeedviewComponent;

  constructor(
    public userCan: Capabilities,
    public router: Router,
    public collections: CollectionsService,
    public asset: AssetService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionsStoreI>,
    public currentUser: CurrentUserService,
    public uiState: UiState,
    public error: ErrorStore,
    public uiConfig: UiConfig,
    public cart: CartService,
    public userPreference: UserPreferenceService,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private renderer: Renderer,
    private window: WindowRef,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    @Inject(DOCUMENT) private document: any) {
    this.screenWidth = this.window.nativeWindow.innerWidth;
    this.window.nativeWindow.onresize = () => this.screenWidth = this.window.nativeWindow.innerWidth;
  }

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

  public showSpeedview(speedviewEvent: SpeedviewEvent): void {
    if (speedviewEvent.asset.speedviewData) {
      // set the data on the wzSpeedview component instance
      this.wzSpeedview.speedviewAssetInfo = speedviewEvent.asset.speedviewData;
      // show the speedview overlay in the calculated position
      this.wzSpeedview.show(speedviewEvent.position);
      // force the video player to start playing
      this.wzSpeedview.previewUrl = speedviewEvent.asset.speedviewData.url;
    } else {
      this.asset.getSpeedviewData(speedviewEvent.asset.assetId).subscribe((data: SpeedviewData) => {
        // cache the speedview data on the asset
        speedviewEvent.asset.speedviewData = data;
        // set the data on the wzSpeedview component instance
        this.wzSpeedview.speedviewAssetInfo = data;
        // show the speedview overlay in the calculated position
        this.wzSpeedview.show(speedviewEvent.position);
        // force the video player to start playing
        this.wzSpeedview.previewUrl = data.url;
      });
    }
    this.renderer.listenGlobal('document', 'scroll', () => this.wzSpeedview.destroy());
  }

  public hideSpeedview(): void {
    this.wzSpeedview.previewUrl = null;
    this.wzSpeedview.speedviewAssetInfo = null;
    this.wzSpeedview.destroy();
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
    this.showSnackBar({
      key: 'COLLECTION.REMOVE_FROM_COLLECTION_TOAST',
      value: { collectionName: this.activeCollection.state.name }
    });
  }

  public changePage(i: any): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/collections/' + this.collection.id, this.routeParams]);
  }

  public downloadComp(params: any): void {
    this.asset.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.nativeWindow.location.href = res.url;
      } else {
        this.error.dispatch({ status: 'COMPS.NO_COMP' });
      }
    });
  }

  public setCollectionForDelete(): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: CollectionDeleteComponent,
        dialogConfig: { position: { top: '14%' } },
        inputOptions: {
          collection: JSON.parse(JSON.stringify(this.collection)),
        },
        outputOptions: [{
          event: 'deleteEvent',
          callback: (event: WzEvent) => this.deleteCollection(event.payload),
          closeOnEvent: true
        }]
      }
    );
  }

  public deleteCollection(id: number) {
    this.router.navigate(['/collections']).then(() => {
      this.collections.delete(id).subscribe(response => {
        this.showSnackBar({ key: 'Your collection has been deleted' });
      });
    });
  }

  public addAssetToCart(asset: any): void {
    let params: AddAssetParameters = { lineItem: { asset: asset } };

    if (this.userCan.administerQuotes()) {
      this.quoteEditService.addAssetToProjectInQuote(params);
    } else {
      this.cart.addAssetToProjectInCart(params);
    }
    this.showSnackBar({
      key: this.userCan.administerQuotes() ? 'ASSET.ADD_TO_QUOTE_TOAST' : 'ASSET.ADD_TO_CART_TOAST',
      value: { assetId: asset.name }
    });
  }

  public getAssetsForLink(): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: CollectionLinkComponent,
        inputOptions: { assets: this.collection.assets.items }
      }
    );
  }

  public editAsset(asset: any) {
    this.asset.getClipPreviewData(asset.assetId)
      .subscribe(data => {
        this.document.body.classList.add('subclipping-edit-open');
        asset.clipUrl = data.url;
        this.dialogService.openComponentInDialog(
          {
            componentType: WzSubclipEditorComponent,
            dialogConfig: { width: '544px' },
            inputOptions: {
              window: this.window.nativeWindow,
              enhancedAsset: this.asset.enhance(asset),
              usagePrice: null
            },
            outputOptions: [
              {
                event: 'cancel',
                callback: (event: any) => { return true; },
                closeOnEvent: true
              },
              {
                event: 'save',
                callback: (updatedMarkers: SubclipMarkers) => {
                  this.activeCollection.updateAsset(this.collection.id, asset, updatedMarkers).subscribe();
                },
                closeOnEvent: true
              }
            ]
          }
        ).subscribe(_ => {
          this.document.body.classList.remove('subclipping-edit-open');
        });
      });
  }

  public editCollection() {
    this.uiConfig.get('collection').take(1).subscribe((config: any) => {
      this.dialogService.openComponentInDialog(
        {
          componentType: CollectionFormComponent,
          inputOptions: {
            collection: JSON.parse(JSON.stringify(this.collection)),
            fields: config.config,
            isEdit: true
          },
          outputOptions: [{
            event: 'collectionSaved',
            callback: (event: WzEvent) => true,
            closeOnEvent: true
          }]
        }
      );
    });
  }

  public onChangeAssetView(assetView: any): void {
    this.userPreference.updateAssetViewPreference(assetView);
  }
}
