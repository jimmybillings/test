import {
  Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Collection, CollectionsStoreI } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../store/services/asset.service';
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
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { AddAssetParameters } from '../../shared/interfaces/commerce.interface';
import { CommentParentObject } from '../../shared/interfaces/comment.interface';
import { QuoteEditService } from '../../shared/services/quote-edit.service';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzEvent, Coords } from '../../shared/interfaces/common.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { AppStore } from '../../app.store';
import { enhanceAsset } from '../../shared/interfaces/enhanced-asset';
import { Common } from '../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionShowComponent implements OnInit, OnDestroy {
  public activeCollection: Collection;
  public assets: any;
  public routeParams: any;
  public errorMessage: string;
  public commentFormConfig: FormFields;
  public screenWidth: number;
  public commentParentObject: CommentParentObject;
  public showComments: boolean = null;
  @ViewChild(WzSpeedviewComponent) public wzSpeedview: WzSpeedviewComponent;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;


  constructor(
    public userCan: Capabilities,
    public router: Router,
    public collections: CollectionsService,
    public asset: AssetService,
    public collectionsStore: Store<CollectionsStoreI>,
    public uiState: UiState,
    public uiConfig: UiConfig,
    public cart: CartService,
    public userPreference: UserPreferenceService,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private window: WindowRef,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    @Inject(DOCUMENT) private document: any,
    private store: AppStore,
    private changeDetectorRef: ChangeDetectorRef) {
    this.screenWidth = this.window.nativeWindow.innerWidth;
    this.window.nativeWindow.onresize = () => this.screenWidth = this.window.nativeWindow.innerWidth;
  }

  ngOnInit() {
    this.activeCollectionSubscription =
      this.store.select(state => state.activeCollection)
        .filter(state => !state.loading)
        .map(state => {
          let collection: Collection = Common.clone(state.collection);
          if (collection.assets && collection.assets.items) {
            collection.assets.items = collection.assets.items
              .map(item => enhanceAsset(item, 'collectionAsset', collection.id));
          }
          return collection;
        })
        .subscribe(collection => {
          this.activeCollection = collection;
          if (collection.id) { // We only want to do these things when there is a valid active collection
            this.commentParentObject = { objectType: 'collection', objectId: collection.id };
            this.store.dispatch(factory => factory.comment.getCounts(this.commentParentObject));
          }
          // The view needs to update whenever the activeCollection changes (including individual assets).  This is
          // a direct store subscription, not an @Input(), so we have to trigger change detection ourselves.
          this.changeDetectorRef.markForCheck();
        });

    this.routeSubscription = this.route.params.subscribe(params => this.buildRouteParams(params));
    this.uiConfig.get('collectionComment').take(1).subscribe((config: any) => this.commentFormConfig = config.config.form.items);
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
    this.activeCollection = Object.assign({}, this.activeCollection);
  }

  public buildRouteParams(params: any): void {
    this.routeParams = Object.assign({}, this.routeParams, params);
    delete (this.routeParams['id']);
  }

  public changePage(i: any): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/collections/' + this.activeCollection.id, this.routeParams]);
  }

  public downloadComp(params: any): void {
    this.asset.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.nativeWindow.location.href = res.url;
      } else {
        this.store.dispatch(factory => factory.error.handleCustomError('COMPS.NO_COMP'));
      }
    });
  }

  public setCollectionForDelete(): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: CollectionDeleteComponent,
        dialogConfig: { position: { top: '14%' } },
        inputOptions: {
          collection: Common.clone(this.activeCollection),
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
        inputOptions: { assets: this.activeCollection.assets.items }
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
              enhancedAsset: asset,
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
                  this.store.dispatch(factory => factory.activeCollection.updateAssetMarkers(asset, updatedMarkers));
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
            collection: Common.clone(this.activeCollection),
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

  public toggleCommentsVisibility(): void {
    this.showComments = !this.showComments;
  }

  public get commentCount(): Observable<number> {
    return this.store.select(state => state.comment.collection.pagination.totalCount);
  }

  public get userCanEditCollection(): Observable<boolean> {
    return this.userCan.editCollection(this.activeCollection);
  }
}
