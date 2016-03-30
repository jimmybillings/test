import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/**
 * Directive that renders details of a single asset
 */  
@Component({
  selector: 'asset-detail',
  templateUrl: 'components/asset-detail/asset-detail.html',
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetail {
  @Input() public assetDetail: AssetDetail;
  @Input() currentUser;
  // @Input() config;
  
  ngOnInit(): void {
    // this.config = this.config.config;
    console.log(this.assetDetail);
  }
}




