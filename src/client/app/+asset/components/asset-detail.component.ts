import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { MdMenuTrigger } from '@angular/material';
import { TranscodeTarget } from '../../shared/interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: any;
  @Input() public inActiveCollection: boolean;
  @Input() currentUser: CurrentUser;
  @Input() userCan: any;
  @Input() collection: Collection;
  @Input() searchContext: any;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  public selectedTarget: TranscodeTarget;
  private assetsArr: Array<number>;

  constructor(
    public uiState: UiState,
    public uiConfig: UiConfig) {
    this.assetsArr = [];
  }

  ngOnChanges(changes: any): void {
    if (changes.asset) {
      this.selectedTarget = null;
      if (Object.keys(changes.asset.currentValue.detailTypeMap.common).length > 0) {
        this.asset = changes.asset.currentValue.detailTypeMap;
        this.asset.clipUrl = changes.asset.currentValue.clipUrl;
        this.asset.clipThumbnailUrl = changes.asset.currentValue.clipThumbnailUrl;
        this.asset.resourceClass = changes.asset.currentValue.resourceClass;
        this.asset.hasDownloadableComp = changes.asset.currentValue.hasDownloadableComp;
        this.asset.assetId = changes.asset.currentValue.assetId;
        this.asset.price = changes.asset.currentValue.price;
        this.asset.transcodeTargets = this.format(changes.asset.currentValue.transcodeTargets);
        this.selectedTarget = this.asset.transcodeTargets[0];
        // the "+" in +this.asset.common[0].vaue changes it from a string to a number
        this.inActiveCollection = this.alreadyInCollection(+this.asset.common[0].value);
      }
    }
    if (changes.collection && changes.collection.currentValue) {
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

  public downloadComp(assetId: any, compType: any): void {
    this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
  }

  public addAssetToCart(assetId: any): void {
    this.addToCart.emit({ assetId: assetId, selectedTranscodeTarget: this.selectedTarget.name });
  }

  public selectTarget(selectedTarget: TranscodeTarget): void {
    this.selectedTarget = selectedTarget;
  }

  private format(targets: Array<string>): Array<TranscodeTarget> {
    return targets.map((target: string) => {
      return { name: target, selected: false };
    });
  }
}
