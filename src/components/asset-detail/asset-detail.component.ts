import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES, NgIf, NgFor } from 'angular2/common';
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
  @Input() public assetDetail;
  @Input() currentUser;
}




