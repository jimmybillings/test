import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AssetShareParameters } from '../../shared/interfaces/common.interface';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import { SubclipMarkers, bothMarkersAreSet } from '../../shared/interfaces/subclip-markers';
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
    this.requestClose();
  }
  @Input() subclipMarkers: SubclipMarkers;
  @Output() closeRequest: EventEmitter<null> = new EventEmitter();

  public shareLink: Observable<string>;

  private currentAsset: EnhancedAsset;

  constructor(private store: AppStore) { }

  public ngOnInit(): void {
    this.shareLink = this.store.select(state => state.sharing.assetLink);
  }

  public get shareAssetDialogTitle(): string {
    return bothMarkersAreSet(this.subclipMarkers)
      ? 'ASSET.SHARING.SUBCLIP_DIALOG_HEADER_TITLE'
      : 'ASSET.SHARING.DIALOG_HEADER_TITLE';
  }

  public get showSubclippingInfo(): boolean {
    return bothMarkersAreSet(this.subclipMarkers);
  }

  public get assetName(): string {
    return this.currentAsset.getMetadataValueFor('name');
  }

  public onShareLinkRequest(): void {
    this.store.dispatch(factory => factory.sharing.createAssetShareLink(this.currentAsset.assetId, this.subclipMarkers));
  }

  public onCloseRequest(): void {
    this.requestClose();
  }

  public onFormSubmit(shareParameters: AssetShareParameters): void {
    this.store.dispatch(factory =>
      factory.sharing.emailAssetShareLink(this.currentAsset.assetId, this.subclipMarkers, shareParameters)
    );
  }

  private requestClose(): void {
    this.closeRequest.emit();
  }
}
