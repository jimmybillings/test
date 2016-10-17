import { Component } from '@angular/core';
import { OrderService } from './services/order.service';

@Component({
  moduleId: module.id,
  selector: 'order-component',
  templateUrl: 'order.html'
})

export class OrderComponent {
  constructor(private order: OrderService) { }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public formatTime(timecode: any): string {
    switch (timecode) {
      case -1:
        return 'End';
      case -2:
        return 'Beginning';
      default:
        return '';
    }
  }
}
