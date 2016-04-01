import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES, NgIf, NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

/**
 * Directive that renders details of a single asset
 */  
@Component({
  selector: 'asset-detail',
  templateUrl: 'components/asset-detail/asset-detail.html',
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetail {
  @Input() public assetDetail: AssetDetail;
  @Input() currentUser;
  public f4VideoUrl: Object;
  // @Input() config;
  
  ngOnInit(): void {
    // this.config = this.config.config;
    console.log(this.assetDetail);
    this.getF4vVideo(this.assetDetail);
  }
  public getF4vVideo(assetDetail) {
    this.f4VideoUrl = assetDetail.renditions.filter(function(rend) {
      return rend.format === 'Flash-4 Video' &&  rend.size === 'Large' &&  rend.purpose === 'Preview';
    })[0].internalUrls['http-Html5Preview'];
    
  }
}




