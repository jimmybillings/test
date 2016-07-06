import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnChanges} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {PlayerComponent} from '../../components/player/player.component';
import { Collection } from '../../interfaces/collection.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  directives: [
    ROUTER_DIRECTIVES,
    PlayerComponent
  ],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  public secondaryKeys: Array<string>;
  public secondaryMdata: Object;
  @Input() public assetDetail: any;
  @Input() currentUser: any;
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();

  ngOnChanges(changes: any): void {
    if (changes.assetDetail) {
      if (Object.keys(changes.assetDetail.currentValue.common).length > 0) {
        this.assetDetail = changes.assetDetail.currentValue;
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

  public showNewCollection(assetId: any): void {
    this.onShowNewCollection.emit(assetId);
  }
}
