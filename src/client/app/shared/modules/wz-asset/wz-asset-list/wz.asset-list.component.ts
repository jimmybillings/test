import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WzAsset } from '../wz-asset';
import { AssetService } from '../../../../shared/services/asset.service';

@Component({
  moduleId: module.id,
  selector: 'wz-asset-list',
  templateUrl: 'wz.asset-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzAssetListComponent extends WzAsset {
  constructor(assetService: AssetService) {
    super(assetService);
  }
}
