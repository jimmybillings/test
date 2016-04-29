import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES, NgIf, NgFor } from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Player} from '../../components/player/player.component';

/**
 * Directive that renders details of a single asset
 */  
@Component({
  selector: 'asset-detail',
  templateUrl: 'components/asset-detail/asset-detail.html',
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES, NgIf, NgFor, Player],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetail {
  @Input() public assetDetail;
  @Input() currentUser;
  
  public getMetaField(field) {
    let meta = this.assetDetail.clipData.filter(item => item.name === field)[0];  
    if (meta) return meta.value; 
  }
}
