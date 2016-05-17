import {Component, Input, ChangeDetectionStrategy, HostListener} from 'angular2/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {COMMON_DIRECTIVES, NgIf, NgFor } from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Player} from '../../components/player/player.component';

/**
 * Directive that renders details of a single asset
 */  
@Component({
  selector: 'asset-detail',
  templateUrl: 'components/asset-detail/asset-detail.html',
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, NgIf, NgFor, Player],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetail {
  public secondaryKeys: Array<string>;
  public secondaryMdata: Object;
  @Input() public assetDetail;
  @Input() currentUser;

  @HostListener('click', ['$event.target']) click(target) {
     console.log('host listened click');
  }
  ngOnChanges(changes): void {
    console.log('changes made');
    if (Object.keys(changes.assetDetail.currentValue.common).length > 0) {
      this.assetDetail = changes.assetDetail.currentValue;
      console.log(this.assetDetail);
      this.secondaryMdata = this.assetDetail.secondary[0];
      this.secondaryKeys = Object.keys(this.secondaryMdata);
    }
  }
  ngOnInit(): void {
    console.log('init hit');
    this.showMetaData(); //this doesn't work.
  }
  
  public getMetaField(field) {
    let meta = this.assetDetail.clipData.filter(item => item.name === field)[0];  
    if (meta) return meta.value;
  }
  
  public showMetaData() {
    let assetDetail = <HTMLElement>document.querySelector('asset-detail section.theater');
    assetDetail.click();
  }
  
  public translationReady(field) {
    return 'assetmetadata.'+field.replace(/\./g, '_');
  }
}
