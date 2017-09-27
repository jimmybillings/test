import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WzAsset } from '../wz-asset';
import { AppStore } from '../../../../app.store';
import { UiConfig } from '../../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'wz-asset-grid',
  templateUrl: 'wz.asset-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzAssetGridComponent extends WzAsset {
  constructor(store: AppStore, uiConfig: UiConfig) {
    super(store, uiConfig);
  }
}
