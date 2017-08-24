import { Component, Input, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { CollectionLinkComponent } from '../../+collection/components/collection-link.component';
import { CollectionFormComponent } from './components/collection-form.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Asset, WzEvent } from '../../shared/interfaces/common.interface';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';

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

  @Output() onOpenSnackbar = new EventEmitter();

  public pageSize: string;

  public get collection(): any {
    return this._collection;
  }

  private _collection: any;
  private enhancedAssets: { [uuid: string]: EnhancedAsset } = {};

  constructor(private dialogService: WzDialogService) { }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
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
        inputOptions: {
          fields: config.config,
        },
        outputOptions: [{
          event: 'collectionSaved',
          callback: (event: WzEvent) => true,
          closeOnEvent: true
        }]
      });
    });
  }
}
