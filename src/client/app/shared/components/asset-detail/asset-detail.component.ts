import {Component, Input, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {PlayerComponent} from '../../components/player/player.component';

/**
 * Directive that renders details of a single asset
 */
@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  directives: [
    ROUTER_DIRECTIVES,
    PlayerComponent
  ],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnInit, OnChanges {
  public secondaryKeys: Array<string>;
  public secondaryMdata: Object;
  @Input() public assetDetail: any;
  @Input() currentUser: any;


  // @HostListener('click', ['$event.target']) click(target: any) {
  //   console.log('host listened click');
  // }
  ngOnChanges(changes: any): void {
    console.log('changes made');
    if (Object.keys(changes.assetDetail.currentValue.common).length > 0) {
      this.assetDetail = changes.assetDetail.currentValue;
      console.log(this.assetDetail);
      this.secondaryMdata = this.assetDetail.secondary[0];
      this.secondaryKeys = Object.keys(this.secondaryMdata);
      console.log(this.secondaryKeys);
    }
  }

  ngOnInit(): void {
    console.log('init hit');
    // this.showMetaData(); //this doesn't work.
  }

  public getMetaField(field: any) {
    let meta = this.assetDetail.clipData.filter((item: any) => item.name === field)[0];
    if (meta) return meta.value;
  }

  // public showMetaData() {
  //   let detailSection: any = <HTMLElement>document.querySelector('asset-detail section.theater');
  //   detailSection.click();
  // }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }
}
