import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CollectionLinkComponent } from '../../+collection/components/collection-link.component';
import { CollectionFormComponent } from './components/collection-form.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Asset, WzEvent, UiConfigComponents } from '../../shared/interfaces/common.interface';
import { Collection } from '../../shared/interfaces/collection.interface';
import { EnhancedAsset, enhanceAsset } from '../../shared/interfaces/enhanced-asset';
import { AppStore } from '../../app.store';
import { Common } from '../../shared/utilities/common.functions';
import { CollectionListDdComponent } from './components/collections-list-dd.component';

@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent implements OnInit {
  @Input() userPreference: any;
  public pageSize: string;
  public collection: Subject<Collection> = new Subject();;
  public collectionFormConfig: any;
  private enhancedAssets: { [uuid: string]: EnhancedAsset } = {};

  constructor(private dialogService: WzDialogService, private store: AppStore) { }

  ngOnInit() {
    this.store.dispatch(factory => factory.activeCollection.loadIfNeeded());
    this.setCollection();
    const config: UiConfigComponents = this.store.snapshotCloned(state => state.uiConfig.components);
    this.pageSize = config.global.config.pageSize.value;
    this.collectionFormConfig = config.collection.config;
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
    let items: Asset[];
    this.collection.take(1).subscribe(collection => items = collection.assets.items);
    this.dialogService.openComponentInDialog({
      componentType: CollectionLinkComponent,
      inputOptions: { assets: items }
    });
  }

  public createCollectionlistDialog() {
    this.dialogService.openComponentInDialog({
      componentType: CollectionListDdComponent,
      dialogConfig: { panelClass: 'collection-list-dd-component' },
      inputOptions: {
        focusedCollection: this.collection,
        config: this.collectionFormConfig
      },
      outputOptions: [{
        event: 'close',
        callback: () => true,
        closeOnEvent: true
      }]
    });
  }

  public createCollection() {
    this.dialogService.openComponentInDialog({
      componentType: CollectionFormComponent,
      dialogConfig: { position: { top: '10%' } },
      inputOptions: {
        fields: this.collectionFormConfig,
        collectionActionType: 'create'
      },
      outputOptions: [{
        event: 'collectionSaved',
        callback: (collection: Collection | undefined) => {
          if (collection) {
            this.store.dispatch(factory => factory.router.goToCollection(collection.id));
          }
        },
        closeOnEvent: true
      }]
    });
  }

  private setCollection() {
    this.store.select(state => state.activeCollection)
      .filter(state => state.collection !== undefined)
      .map(state => {
        let collection: Collection = Common.clone(state.collection);
        if (collection.assets && collection.assets.items) {
          collection.assets.items = collection.assets.items
            .map(item => enhanceAsset(item, 'collectionAsset', collection.id));
        }
        return collection;
      }).subscribe((collection) => this.collection.next(collection));
  }
}
