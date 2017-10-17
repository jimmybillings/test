import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppStore } from '../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'wz-delivery-options',
  templateUrl: './wz.delivery-options.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzDeliveryOptionsComponent {
  constructor(private store: AppStore) { }
}
