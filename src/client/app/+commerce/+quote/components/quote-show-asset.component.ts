import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StateMapper } from '../../../app.store';
import { Asset } from '../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-show-asset',
  template: `
    <asset-component
      [assetType]="'quoteShowAsset'"
      [stateMapper]="stateMapper">
    </asset-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteShowAssetComponent {
  public stateMapper: StateMapper<Asset> = (state) => state.quoteShowAsset.activeAsset;
}
