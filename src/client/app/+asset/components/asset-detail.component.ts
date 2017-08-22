import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { Observable } from 'rxjs/Observable';
import { Frame } from 'wazee-frame-formatter';
import { AppStore } from '../../app.store';
import { Asset } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: Asset;
  @Input() public userEmail: Observable<string>;
  @Input() public userCan: Capabilities;
  @Input() public uiConfig: UiConfig;
  @Input() public activeCollection: Collection;
  @Input() public usagePrice: Observable<number>;
  @Input() public window: Window;
  @Output() onDownloadComp = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() getPriceAttributes = new EventEmitter();
  @Output() onShowSnackBar = new EventEmitter();
  @Output() onPreviousPage = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  public selectedTarget: string;
  public showAssetSaveSubclip: boolean = false;
  public subclipMarkers: SubclipMarkers;
  private assetsArr: Array<number> = [];

  constructor(private store: AppStore) { }

  ngOnChanges(changes: any): void {
    if (changes.asset) this.parseNewAsset(changes.asset);
    if (changes.activeCollection) {
      this.assetsArr = changes.activeCollection.currentValue.assets.items.map((x: any) => x.assetId);
    }
  }

  public get hasPageHistory() {
    return this.window.history.length > 2;
  }

  public previousPage() {
    this.onPreviousPage.emit();
  }

  public alreadyInCollection(assetId: any): boolean {
    assetId = parseInt(assetId);
    return this.assetsArr.indexOf(assetId) > -1;
  }

  public onPlayerMarkersInitialization(initialMarkers: SubclipMarkers): void {
    this.subclipMarkers = initialMarkers;
    this.showAssetSaveSubclip = false;
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
    this.subclipMarkers = newMarkers;
    this.showAssetSaveSubclip = this.markersAreDefined;
    if (this.markersAreDefined) {
      this.store.dispatch(factory => factory.asset.updateMarkersInUrl(this.subclipMarkers, this.asset.assetId));
    }
  }

  public get markersSaveButtonEnabled(): boolean {
    return !this.showAssetSaveSubclip && this.markersAreDefined;
  }

  public onPlayerMarkerSaveButtonClick(): void {
    this.showAssetSaveSubclip = true;
  }

  public toggleAssetSaveSubclip(): void {
    this.showAssetSaveSubclip = !this.showAssetSaveSubclip;
  }

  public addAssetToActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.addAsset(this.asset));
  }

  public removeAssetFromActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.removeAsset(this.asset));
  }

  public downloadComp(assetId: any, compType: any): void {
    this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
  }

  public addAssetToCart(): void {
    this.addToCart.emit({
      assetId: this.asset.assetId,
      markers: null,
      selectedTranscodeTarget: this.selectedTarget
    });
  }

  public addSubclipToCart(): void {
    this.addToCart.emit({
      assetId: this.asset.assetId,
      markers: this.subclipMarkers,
      selectedTranscodeTarget: this.selectedTarget
    });
  }

  public getPricingAttributes(): void {
    this.getPriceAttributes.emit(this.asset.primary[3].value);
  }

  public onSelectTarget(target: any): void {
    this.selectedTarget = target.value;
  }

  public showComments(event: any): void {
    // This is referenced in the template, but did not exist.  Assuming this is for future implementation.
  }

  private parseNewAsset(asset: any) {

    this.usagePrice = null;
    if (this.asset.transcodeTargets) {
      this.selectedTarget = this.asset.transcodeTargets[0];
    }
  }

  private get markersAreDefined(): boolean {
    return !!this.subclipMarkers && !!this.subclipMarkers.in && !!this.subclipMarkers.out;
  }
}
