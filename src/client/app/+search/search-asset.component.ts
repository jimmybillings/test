import { Component, ChangeDetectionStrategy } from '@angular/core';

import { StateMapper } from '../app.store';
import { Asset } from '../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'search-asset',
  template: `<asset-component [stateMapper]="stateMapper" [assetType]="'searchAsset'"></asset-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAssetComponent {
  public stateMapper: StateMapper<Asset> = (state) => state.searchAsset.activeAsset;
}
