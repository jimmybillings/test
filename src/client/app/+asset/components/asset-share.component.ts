import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FormFields } from '../../shared/interfaces/forms.interface';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Subscription } from 'rxjs/Subscription';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';
import { AppStore } from '../../app.store';

@Component({
  moduleId: module.id,
  selector: 'asset-share',
  templateUrl: 'asset-share.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetShareComponent {
  @Input() config: any;
  @Input() set enhancedAsset(asset: EnhancedAsset) {
    this.currentAsset = asset;
    this.close();
  }
  @Input() subclipMarkers: SubclipMarkersInterface.SubclipMarkers;
  @Output() closeRequest = new EventEmitter();

  public shareLink: Observable<string>;

  private currentAsset: EnhancedAsset;

  constructor(private store: AppStore) { }

  public ngOnInit(): void {
    this.shareLink = this.store.select(state => state.sharing.assetLink);
  }

  public get shareAssetDialogTitle(): string {
    return SubclipMarkersInterface.bothMarkersAreSet(this.subclipMarkers)
      ? 'ASSET.SHARING.SUBCLIP_DIALOG_HEADER_TITLE'
      : 'ASSET.SHARING.DIALOG_HEADER_TITLE';
  }

  public get showSubclippingInfo(): boolean {
    return SubclipMarkersInterface.bothMarkersAreSet(this.subclipMarkers);
  }

  public get assetName(): string {
    return this.currentAsset.getMetadataValueFor('name');
  }

  public onShareLinkRequest(): void {
    this.store.dispatch(factory => factory.sharing.createAssetShareLink(this.currentAsset.assetId, this.subclipMarkers));
  }

  public onCloseRequest(): void {
    this.close();
  }

  public onFormSubmit(shareParameters: Pojo): void {
    this.store.dispatch(factory =>
      factory.sharing.emailAssetShareLink(this.currentAsset.assetId, this.subclipMarkers, shareParameters)
    );
  }

  private close(): void {
    this.closeRequest.emit();
  }
}
