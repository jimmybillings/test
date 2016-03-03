import {Component, Input} from 'angular2/core';
import {COMMON_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
// import {Asset} from '../../../common/interfaces/asset.interface';

/**
 * Directive that renders a list of assets
 */  
@Component({
  selector: 'asset-list',
  templateUrl: 'components/search/asset-list/asset-list.html',
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES]
})

export class AssetList {
  @Input() public assets: Array<AssetList>;
}
