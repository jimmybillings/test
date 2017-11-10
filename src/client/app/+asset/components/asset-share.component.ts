import { Component, ChangeDetectionStrategy, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
export class AssetShareComponent implements OnDestroy {
  @Input() userEmail: string;
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

  public ngOnDestroy(): void {
    this.close();
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
    this.shareLink =
      this.store.callLegacyServiceMethod(service => service.asset.createShareLink(this.backendify()))
        .map(response => `${window.location.href};share_key=${response.apiKey}`);
  }

  public onCloseRequest(): void {
    this.close();
  }

  public onFormSubmit(shareParameters: Pojo): void {
    this.store.callLegacyServiceMethod(service => service.asset.createShareLink(this.backendify(shareParameters)))
      .subscribe(() => {
        this.store.dispatch(factory => factory.snackbar.display('ASSET.SHARING.SHARED_CONFIRMED_MESSAGE'));
      });
  }

  private backendify(shareParameters: Pojo = {}): Pojo {
    const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(this.subclipMarkers);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    Object.assign(shareParameters, {
      accessEndDate: this.IsoFormatLocalDate(endDate),
      accessStartDate: this.IsoFormatLocalDate(new Date()),
      accessInfo: this.currentAsset.assetId,
      type: 'asset',
      recipientEmails: (shareParameters.recipientEmails) ?
        shareParameters.recipientEmails.split(/\s*,\s*|\s*;\s*/) : [],
      properties: {
        timeStart: duration.timeStart,
        timeEnd: duration.timeEnd
      }
    });

    if (shareParameters.copyMe) {
      shareParameters.recipientEmails.push(this.userEmail);
    }

    return shareParameters;
  }

  // we need to submit date/timestamps in ISO format. This does that.
  private IsoFormatLocalDate(date: Date) {
    var d = date,
      tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear()
      + '-' + pad(d.getMonth() + 1)
      + '-' + pad(d.getDate())
      + 'T' + pad(d.getHours())
      + ':' + pad(d.getMinutes())
      + ':' + pad(d.getSeconds())
      + dif + pad(tzo / 60)
      + ':' + pad(tzo % 60);
  }

  private close(): void {
    this.closeRequest.emit();
  }
}
