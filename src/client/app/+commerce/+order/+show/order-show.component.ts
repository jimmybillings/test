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

  public downloadMaster(masterUrl: string): void {
    this.window.nativeWindow.location.href = masterUrl;
  }

  public displayOrderAssetCount(count: number): string {
    if (count > 0) {
      return (count === 1) ? 'ORDER.PROJECTS.ONLY_ONE_ASSET' : 'ORDER.PROJECTS.MORE_THAN_ONE_ASSET';
    } else return 'ORDER.PROJECTS.NO_ASSETS';
  }
}
