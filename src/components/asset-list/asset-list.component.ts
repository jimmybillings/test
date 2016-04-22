import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {COMMON_DIRECTIVES} from 'angular2/common';

/**
 * Directive that renders a list of assets
 */  
@Component({
  selector: 'asset-list',
  templateUrl: 'components/asset-list/asset-list.html',
  directives: [COMMON_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetList {
  @Input() public assets: Array<AssetList>;
  @Input() public currentUser;
  @Output() onShowAsset = new EventEmitter();
   
  showAsset(asset): void {
    this.onShowAsset.emit(asset);
  }
  
  public formatType(format): string {
    switch (format) {
      case 'High Definition':
        return 'hd';
      case 'Standard Definition':
        return 'sd';
      case 'Digital Video':
        return 'dv';
      default:
        return 'hd';
    }
  }
}
