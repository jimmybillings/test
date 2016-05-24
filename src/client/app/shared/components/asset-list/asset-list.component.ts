import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';


/**
 * Directive that renders a list of assets
 */
@Component({
  moduleId: module.id,
  selector: 'asset-list',
  templateUrl: 'asset-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetListComponent {
  @Input() public assets: Array<any>;
  @Input() public currentUser: any;
  @Output() onShowAsset = new EventEmitter();

  showAsset(asset: any): void {
    this.onShowAsset.emit(asset);
  }

  public formatType(format: any): string {
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
