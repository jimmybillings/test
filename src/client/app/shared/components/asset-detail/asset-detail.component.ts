import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {PlayerComponent} from '../../components/player/player.component';
import { Collection } from '../../interfaces/collection.interface';

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
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();


  // @HostListener('click', ['$event.target']) click(target: any) {
  //   console.log('host listened click');
  // }
  ngOnChanges(changes: any): void {
    if (changes.assetDetail) {
      if (Object.keys(changes.assetDetail.currentValue.common).length > 0) {
        this.assetDetail = changes.assetDetail.currentValue;
        console.log(this.assetDetail);
        this.secondaryMdata = this.assetDetail.secondary[0];
        this.secondaryKeys = Object.keys(this.secondaryMdata);
        console.log(this.secondaryKeys);
      }
    }
  }

  ngOnInit(): void {
    console.log('init hit');
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

  public addToCollection(assetId: any): void {
    this.onAddToCollection.emit({'collection': this.collection, 'assetId':assetId});
  }

  public showNewCollection(assetId: any): void {
    this.onShowNewCollection.emit(assetId);
  }
}
