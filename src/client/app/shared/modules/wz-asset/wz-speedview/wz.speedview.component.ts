import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SpeedviewData } from '../../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-speedview',
  templateUrl: 'wz.speedview.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzSpeedviewComponent {
  public speedviewAssetInfo: SpeedviewData;
  public previewUrl: string;

  public translationReady(field: string) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

}
