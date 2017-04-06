import { Component } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { WindowRef } from '../../../shared/services/window-ref.service';

@Component({
  moduleId: module.id,
  selector: 'order-show-component',
  templateUrl: 'order-show.html'
})

export class OrderShowComponent {
  constructor(public window: WindowRef, public order: OrderService) { }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public downloadMaster(masterUrl: string): void {
    this.window.nativeWindow.location.href = masterUrl;
  }
}
