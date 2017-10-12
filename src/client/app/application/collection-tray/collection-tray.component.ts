import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CollectionLinkComponent } from '../../+collection/components/collection-link.component';
import { CollectionFormComponent } from './components/collection-form.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Asset, WzEvent } from '../../shared/interfaces/common.interface';
import { Collection } from '../../shared/interfaces/collection.interface';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import { AppStore } from '../../app.store';

@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent implements OnInit {
  @Input() uiState: any;
  @Input() uiConfig: any;

  @Input() public set collection(collection: any) {
    if (collection) this._collection = collection;
  };
  @Input() userPreference: any;
  public pageSize: string;

  public get collection(): any {
    return this._collection;
  }

  private _collection: any;
  private enhancedAssets: { [uuid: string]: EnhancedAsset } = {};

  constructor(private dialogService: WzDialogService, private store: AppStore) { }

  ngOnInit() {
    // this.store.snapshot(state => {
    //   if (!state.activeCollection.collection.id) {
    this.store.dispatch(factory => factory.activeCollection.loadIfNeeded());
    //   }
    // });

    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public toggleCollectionTray(): void {
    this.userPreference.toggleCollectionTray();
  }

  public hasId(asset: EnhancedAsset): boolean {
    return !!asset && !!(asset.assetId);
  }

  public routerLinkFor(asset: EnhancedAsset): any[] {
    return asset.routerLink;
  }

  public hasThumbnail(asset: EnhancedAsset): boolean {
    return !!asset.thumbnailUrl;
  }

  public thumbnailUrlFor(asset: EnhancedAsset): string {
    return asset.thumbnailUrl;
  }

  public getAssetsForLink(): void {
    this.dialogService.openComponentInDialog({
      componentType: CollectionLinkComponent,
      inputOptions: { assets: this.collection.assets.items }
    });
  }

  public createCollection() {
    this.uiConfig.get('collection').take(1).subscribe((config: any) => {
      this.dialogService.openComponentInDialog({
        componentType: CollectionFormComponent,
        dialogConfig: { position: { top: '10%' } },
        inputOptions: {
          fields: config.config,
          collectionActionType: 'create'
        },
        outputOptions: [{
          event: 'collectionSaved',
          callback: (collection: Collection) => this.store.dispatch(factory => factory.router.goToCollection(collection.id)),
          closeOnEvent: true
        }]
      });
    });
  }
}
