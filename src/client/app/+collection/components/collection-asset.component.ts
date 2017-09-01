import { Component, ChangeDetectionStrategy } from '@angular/core';

import { StateMapper } from '../../app.store';
import { Asset } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'search-asset',
  template: `<asset-component [stateMapper]="stateMapper" [assetType]="'collectionAsset'"></asset-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionAssetComponent {
  public stateMapper: StateMapper<Asset> = (state) => state.activeCollectionAsset.activeAsset;
}
