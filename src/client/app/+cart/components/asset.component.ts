import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Asset, Metadatum } from '../cart.interface';

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

  private cacheMetadata(): void {
    this.asset.metadata.forEach((metadatum: Metadatum) => {
      this.metadata[metadatum.name] = metadatum.value;
    });
  }
}
