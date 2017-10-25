import { Component, ChangeDetectionStrategy } from '@angular/core';

import { StateMapper } from '../../../app.store';
import { Asset } from '../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'order-asset',
  template: `<asset-component [assetType]="'orderAsset'"></asset-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderAssetComponent { }
