import { Component, ChangeDetectionStrategy } from '@angular/core';

import { StateMapper } from '../../../app.store';
import { Asset } from '../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-asset',
  template: `<asset-component [stateMapper]="stateMapper" [assetType]="'quoteAsset'"></asset-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteAssetComponent {
  public stateMapper: StateMapper<Asset> = (state) => state.quoteAsset.activeAsset;
}
