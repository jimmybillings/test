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

  public downloadMaster(masterUrl: string): void {
    window.location.href = masterUrl;
  }
}
