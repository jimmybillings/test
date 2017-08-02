import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WzAsset } from '../wz-asset';
import { AssetService } from '../../../../shared/services/asset.service';
import { AppStore } from '../../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'wz-asset-grid',
  templateUrl: 'wz.asset-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzAssetGridComponent extends WzAsset {
  constructor(assetService: AssetService, store: AppStore) {
    super(assetService, store);
  }
}
