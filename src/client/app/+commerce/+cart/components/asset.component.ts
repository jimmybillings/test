import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Asset, Metadatum } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  // Would prefer simply 'asset-component', but for some reason we have global styles for that selector.
  selector: 'cart-asset-component',
  templateUrl: 'asset.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetComponent implements OnInit {
  @Input() asset: Asset;
  @Output() assetNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public metadata: any = {};

  public ngOnInit(): void {
    this.cacheMetadata();
  }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public assetParams(asset: any) {
    return Object.assign({},
      asset.uuid ? { uuid: asset.uuid } : null,
      asset.timeStart && asset.timeStart >= 0 ? { timeStart: asset.timeStart } : null,
      asset.timeEnd && asset.timeEnd >= 0 ? { timeEnd: asset.timeEnd } : null
    );
  }

  private cacheMetadata(): void {
    this.asset.metadata.forEach((metadatum: Metadatum) => {
      this.metadata[metadatum.name] = metadatum.value;
    });
  }
}
