import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(private asset: AssetService) {
  }

  public closeAssetShare(): void {
    this.close.emit();
  }

  public showShareLink(assetId: any) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate());
    let startDateDb = startDate.toISOString();
    let endDate = new Date();
    endDate.setDate(endDate.getDate()+10);
    let endDateDb = endDate.toISOString();
    console.log(startDateDb);
    console.log(endDateDb);
    // let startDate = '2016-09-22T16:32:34Z';
    // let endDate = '2016-10-02T16:32:34Z';

    // this.asset.getshareLink(assetId,startDateDb,endDateDb).subscribe((res) => {
    //   this.assetShareLink = `${window.location.href}?share_key=${res.apiKey}`;
    //   console.log(this.assetShareLink);
    // });
    this.assetLinkIsShowing = !this.assetLinkIsShowing;
  }
}
