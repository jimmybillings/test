import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AssetService } from '../services/asset.service';

@Component({
  moduleId: module.id,
  selector: 'asset-share',
  templateUrl: 'asset-share.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareComponent {
  @Input() uiState: any;
  @Input() config: any;
  @Input() assetThumbnailUrl: any;
  @Input() assetName: any;
  @Input() assetId: any;
  @Output() close = new EventEmitter();
  public assetLinkIsShowing: boolean = false;
  public assetShareLink: any = '';

  constructor(
    private asset: AssetService,
    private changeDetector: ChangeDetectorRef) {
  }

  public closeAssetShare(): void {
    this.close.emit();
  }

  public showShareLink(assetId: any) {
    // we need to pass ISO formatted time stamps for the start and end time the share link is valid.
    let startDateDb = this.IsoFormatLocalDate(new Date());
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    let endDateDb = this.IsoFormatLocalDate(endDate);
    // console.log(startDateDb);
    // console.log(endDateDb);

    this.asset.getshareLink(assetId,startDateDb,endDateDb).take(1).subscribe((res) => {
      this.assetShareLink = `${window.location.href};share_key=${res.apiKey}`;
      this.changeDetector.markForCheck();
      // console.log(this.assetShareLink);
    });
    this.assetLinkIsShowing = !this.assetLinkIsShowing;
  }

  // we need to submit date/timestamps in ISO format. This does that.
  private IsoFormatLocalDate(date:any) {
    var d = date,
      tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num:any) {
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
}
