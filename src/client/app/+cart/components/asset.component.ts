import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Asset, Metadatum } from '../cart.interface';

@Component({
  moduleId: module.id,
  // Would prefer simply 'asset-component', but for some reason we have global styles for that selector.
  selector: 'cart-asset-component',
  styles: [`
    img {
      float: left;
      margin: 5px;
    }

    p {
      float: left;
      padding: 0 20px;
      margin: 20px 0 0 0;
      width: 200px;
    }

    p.info {
      width: 500px;
      margin: 5px 0 0 0;
    }
  `],
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

  private cacheMetadata(): void {
    this.asset.metadata.forEach((metadatum: Metadatum) => {
      this.metadata[metadatum.name] = metadatum.value;
    });
  }
}
