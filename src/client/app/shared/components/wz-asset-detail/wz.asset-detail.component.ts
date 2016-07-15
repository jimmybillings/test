import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnChanges} from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router';
import { WzPlayerComponent} from '../../components/wz-player/wz.player.component';
import { Collection } from '../../interfaces/collection.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-asset-detail',
  templateUrl: 'wz.asset-detail.html',
  directives: [
    ROUTER_DIRECTIVES,
    WzPlayerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzAssetDetailComponent implements OnChanges {
  public secondaryKeys: Array<string>;
  public secondaryMdata: Object;
  @Input() public assetDetail: any;
  @Input() currentUser: any;
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();

  ngOnChanges(changes: any): void {
    console.dir(changes);
    if (changes.assetDetail) {
      if (Object.keys(changes.assetDetail.currentValue.detailTypeMap.common).length > 0) {
        this.assetDetail = changes.assetDetail.currentValue.detailTypeMap;
        this.assetDetail.clipUrl = changes.assetDetail.currentValue.clipUrl;
        this.assetDetail.clipThumbnailUrl = changes.assetDetail.currentValue.clipThumbnailUrl;
        this.secondaryMdata = this.assetDetail.secondary[0];
        this.secondaryKeys = Object.keys(this.secondaryMdata);
      }
    }
  }

  public getMetaField(field: any) {
    let meta = this.assetDetail.clipData.filter((item: any) => item.name === field)[0];
    if (meta) return meta.value;
  }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public addToCollection(collection: Collection, asset: any): void {
    asset.assetId = asset.value;
    this.onAddToCollection.emit({'collection':collection, 'asset':asset});
  }

  public removeFromCollection(collection: Collection, asset: any): void {
    asset.assetId = asset.value;
    this.onRemoveFromCollection.emit({'collection':collection, 'asset':asset});
  }

  public showNewCollection(assetId: any): void {
    this.onShowNewCollection.emit(assetId);
  }
}
