import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router';
import { WzPlayerComponent} from '../../shared/components/wz-player/wz.player.component';
import { Collection } from '../../shared/interfaces/collection.interface';
import { WzToastComponent } from '../../shared/components/wz-toast/wz.toast.component';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  directives: [
    ROUTER_DIRECTIVES,
    WzPlayerComponent,
    WzToastComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: any;
  @Input() public inActiveCollection: boolean;
  @Input() currentUser: any;
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();
  private assetsArr: Array<number>;

  constructor() {
    this.assetsArr = [];
  }

  ngOnChanges(changes: any): void {
    if (changes.asset) {
      if (Object.keys(changes.asset.currentValue.detailTypeMap.common).length > 0) {
        this.asset = changes.asset.currentValue.detailTypeMap;
        this.asset.clipUrl = changes.asset.currentValue.clipUrl;
        this.asset.clipThumbnailUrl = changes.asset.currentValue.clipThumbnailUrl;
        // the "+" in +this.asset.common[0].vaue changes it from a string to a number
        this.inActiveCollection = this.alreadyInCollection(+this.asset.common[0].value);
      }
    }
    if (changes.collection && changes.collection.currentValue && this.collection.assets.items.length > 0) {
      this.assetsArr = this.collection.assets.items.map(function (x) { return x.assetId; });
      // the "+" in +this.asset.common[0].vaue changes it from a string to a number
      this.inActiveCollection = this.alreadyInCollection(+this.asset.common[0].value);
    }
  }

  public alreadyInCollection(assetId: any): boolean {
    return this.assetsArr.indexOf(assetId) > -1;
  }

  public addToCollection(collection: Collection, asset: any): void {
    asset.assetId = asset.value;
    this.onAddToCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public removeFromCollection(collection: Collection, asset: any): void {
    asset.assetId = asset.value;
    this.onRemoveFromCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public showNewCollection(assetId: any): void {
    this.onShowNewCollection.emit(assetId);
  }
}