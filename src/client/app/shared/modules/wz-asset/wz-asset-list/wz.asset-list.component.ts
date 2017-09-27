import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WzAsset } from '../wz-asset';
import { AppStore } from '../../../../app.store';
import { UiConfig } from '../../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'wz-asset-list',
  templateUrl: 'wz.asset-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzAssetListComponent extends WzAsset {
  constructor(store: AppStore, uiConfig: UiConfig) {
    super(store, uiConfig);
  }
}
